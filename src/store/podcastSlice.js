// import { createAsyncThunk } from "@reduxjs/toolkit";
// import toast from "react-hot-toast";
// import { createSlice } from "@reduxjs/toolkit";

// export const createPodcast = createAsyncThunk(
//   "podcasts/createPodcast",
//   async ({ formData, token }, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/api/podcasts", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );
// export const fetchPlaylists = createAsyncThunk(
//   "podcasts/fetchPlaylists",
//   async (_, { getState, rejectWithValue }) => {
//     const { user } = getState();
//     const token = user.token; // Ensure your user state has the token
//     if (!token) {
//       toast.error("Authentication required.");
//       return rejectWithValue("Authentication token not found");
//     }

//     try {
//       const response = await api.get("/api/podcaster/playlists", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       toast.error("Failed to fetch playlists.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const fetchPodcaster = createAsyncThunk(
//   "podcasts/fetchPodcaster",
//   async ({ rejectWithValue }) => {
//     try {
//       const response = await api.get("api/podcasters");
//       return response.data;
//     } catch (error) {
//       toast.error("Failed to fetch podcasters.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const saveToFavorites = createAsyncThunk(
//   "podcasts/saveToFavorites",
//   async (blogId, { getState, rejectWithValue }) => {
//     const { user } = getState();
//     try {
//       const response = await api.post(
//         `/api/users/favorites`,
//         { blogId },
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );
//       return blogId; // Assuming the API only needs the blog ID
//     } catch (error) {
//       toast.error("Failed to save blog to favorites.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// const podcastSlice = createSlice({
//   name: "podcasts",
//   initialState: {
//     podcasts: [],
//     playlists: [],
//     status: "idle",
//     error: null,
//     favorites: [],
//     comments: [],
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createPodcast.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(createPodcast.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.podcasts.push(action.payload);
//       })
//       .addCase(createPodcast.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(fetchPlaylists.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchPlaylists.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.items = action.payload; // assuming the payload is an array of playlists
//       })
//       .addCase(fetchPlaylists.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(fetchPodcaster.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchPodcaster.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.blogs = action.payload;
//       })
//       .addCase(fetchPodcaster.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });
// export const {} = podcastSlice.actions;
// export default podcastSlice.reducer;
