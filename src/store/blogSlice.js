// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import toast from "react-hot-toast";

// export const createBlog = createAsyncThunk(
//   "blog/createBlog",
//   async (blogData, { getState, rejectWithValue }) => {
//     const { user } = getState(); // Ensure you are getting the user token correctly
//     try {
//       const formData = new FormData();
//       Object.keys(blogData).forEach((key) =>
//         formData.append(key, blogData[key])
//       );
//       const response = await api.post("/api/createBlog", formData, {
//         headers: {
//           Authorization: `Bearer ${user.token}`, // Adjust according to where the token is stored
//         },
//       });
//       return response.data;
//     } catch (error) {
//       toast.error("Failed to Create blogs.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const fetchBlogs = createAsyncThunk(
//   "blogs/fetchBlogs",
//   async ({ rejectWithValue }) => {
//     try {
//       const response = await api.get("api/blogs");
//       return response.data;
//     } catch (error) {
//       toast.error("Failed to fetch blogs.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );
// export const fetchBlogDetail = createAsyncThunk(
//   "blogs/fetchBlogDetail",
//   async (blogId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`api/blogs/${blogId}`);
//       return response.data;
//     } catch (error) {
//       toast.error("Failed to fetch blog details.");
//       return rejectWithValue("Failed to fetch blog details");
//     }
//   }
// );
// export const likeBlog = createAsyncThunk(
//   "blog/likeBlog",
//   async (blogId, { getState, rejectWithValue }) => {
//     const { user } = getState();
//     try {
//       const response = await api.post(
//         `/api/blogs/${blogId}/like`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         }
//       );
//       return { blogId, likesCount: response.data.likesCount };
//     } catch (error) {
//       toast.error("Failed to like the blog.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const saveToFavorites = createAsyncThunk(
//   "blog/saveToFavorites",
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

// export const deleteBlog = createAsyncThunk(
//   "blog/deleteBlog",
//   async (blogId, { getState, rejectWithValue }) => {
//     const { user } = getState();
//     try {
//       const response = await api.delete(`/api/blogs/${blogId}`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
//       return blogId; // Return the ID of the deleted blog to remove it from the state
//     } catch (error) {
//       toast.error("Failed to delete the blog.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// export const editBlog = createAsyncThunk(
//   "blog/editBlog",
//   async ({ blogId, title, content, image }, { getState, rejectWithValue }) => {
//     const { user } = getState();
//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("content", content);
//       if (image instanceof File) {
//         // check if it's a file object, not a data URL
//         formData.append("image", image, image.name);
//       }
//       const response = await api.put(`/api/blogs/${blogId}`, formData, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "multipart/form-data", // needed for sending files
//         },
//       });
//       return response.data; // the updated blog data
//     } catch (error) {
//       toast.error("Failed to update the blog.");
//       return rejectWithValue(error.response?.data);
//     }
//   }
// );

// const blogSlice = createSlice({
//   name: "blog",
//   initialState: {
//     blogs: [],
//     status: "idle",
//     error: null,
//     favorites: [],
//     comments: [],
//   },
//   reducers: {
//     addComment(state, action) {
//       const { blogId, comment } = action.payload;
//       const blog = state.blogs.find((blog) => blog.id === blogId);
//       if (blog) {
//         if (!blog.comments) blog.comments = []; // Ensure comments is initialized
//         blog.comments.push(comment);
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createBlog.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(createBlog.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.blogs.push(action.payload);
//         toast.success("Blog created successfully!");
//       })
//       .addCase(createBlog.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(fetchBlogs.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchBlogs.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.blogs = action.payload;
//       })
//       .addCase(fetchBlogs.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       .addCase(fetchBlogDetail.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchBlogDetail.fulfilled, (state, action) => {
//         const index = state.blogs.findIndex(
//           (blog) => blog.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.blogs[index] = { ...state.blogs[index], ...action.payload };
//         } else {
//           state.blogs.push(action.payload);
//         }
//       })
//       .addCase(fetchBlogDetail.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       })
//       .addCase(likeBlog.fulfilled, (state, action) => {
//         const { blogId, likesCount } = action.payload;
//         const blog = state.blogs.find((blog) => blog.id === blogId);
//         if (blog) {
//           blog.likesCount = likesCount;
//         }
//         toast.success("Blog liked successfully!");
//       })
//       .addCase(likeBlog.rejected, (state, action) => {
//         toast.error("Failed to like the blog.");
//       })
//       .addCase(saveToFavorites.fulfilled, (state, action) => {
//         const blog = state.blogs.find((blog) => blog.id === action.payload);
//         if (blog && !state.favorites.includes(blog)) {
//           state.favorites.push(blog);
//         }
//         toast.success("Blog added to favorites!");
//       })
//       .addCase(deleteBlog.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(deleteBlog.fulfilled, (state, action) => {
//         state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
//         state.favorites = state.favorites.filter(
//           (blog) => blog.id !== action.payload
//         );
//         toast.success("Blog deleted successfully!");
//       })
//       .addCase(deleteBlog.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Failed to delete the blog.";
//       })
//       .addCase(editBlog.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(editBlog.fulfilled, (state, action) => {
//         const index = state.blogs.findIndex(
//           (blog) => blog.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.blogs[index] = action.payload; // update the blog with the new data
//         }
//         state.status = "succeeded";
//         toast.success("Blog updated successfully!");
//       })
//       .addCase(editBlog.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload || "Failed to update the blog.";
//       });
//   },
// });
// export const { addComment } = blogSlice.actions;
// export default blogSlice.reducer;
