import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for your API if not already defined globally
const baseUrl = `${process.env.REACT_APP_SERVER_DOMAIN}/api`;

// Setup the RTK Query API for rooms
export const roomApi = createApi({
  reducerPath: "roomApi", // Unique key for the API in the Redux store
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the state
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Set the Authorization header
      }
      return headers;
    },
  }), // Setup baseQuery with the baseUrl
  tagTypes: ["Room"], // Optional: Define tags for automatic re-fetching and caching
  endpoints: (builder) => ({
    // Endpoint to create a room
    createRoom: builder.mutation({
      query: (roomDetails) => ({
        url: "/rooms/createRoom",
        method: "POST",
        body: roomDetails,
      }),
      invalidatesTags: [{ type: "Room", id: "LIST" }], // Invalidate cache tag to refresh room list after creation
    }),
    getAllRooms: builder.query({
      query: () => ({
        url: "/rooms/allRooms",
        method: "POST",
      }),
      providesTags: [{ type: "Room", id: "LIST" }],
    }),
    getRoom: builder.query({
      query: (roomId) => ({
        url: `/rooms/room/${roomId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Room", id }],
    }),
    // You can add more endpoints here such as fetching rooms, updating, etc.
  }),
});
// Export hooks for use in components
export const { useCreateRoomMutation, useGetAllRoomsQuery, useGetRoomQuery } =
  roomApi;
