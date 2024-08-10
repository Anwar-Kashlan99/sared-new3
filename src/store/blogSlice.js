import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for your API if not already defined globally
const baseUrl = `${process.env.REACT_APP_SERVER_DOMAIN}/api`;

// Setup the RTK Query API for rooms
export const blogApi = createApi({
  reducerPath: "blogApi", // Unique key for the API in the Redux store
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
  tagTypes: ["blog"], // Optional: Define tags for automatic re-fetching and caching
  endpoints: (builder) => ({
    // Endpoint to create a blog
    createBlog: builder.mutation({
      query: (blogDetails) => ({
        url: "/blogs/createBlog",
        method: "POST",
        body: blogDetails,
      }),
      invalidatesTags: [{ type: "blog", id: "LIST" }], // Invalidate cache tag to refresh blog list after creation
    }),
    getAllBlogs: builder.query({
      query: () => ({
        url: "/blogs/allBlogs",
        method: "POST",
      }),
      providesTags: [{ type: "blog", id: "LIST" }],
    }),
    getBlog: builder.query({
      query: (blogId) => ({
        url: `/blogs/blog/${blogId}`,
        method: "POST",
      }),
      providesTags: (result, error, id) => [{ type: "blog", id }],
    }),
    // You can add more endpoints here such as fetching blog, updating, etc.
  }),
});

// Export hooks for use in components
export const { useCreateBlogMutation, useGetAllBlogsQuery, useGetBlogQuery } =
  blogApi;
