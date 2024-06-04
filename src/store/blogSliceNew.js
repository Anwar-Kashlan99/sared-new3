import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Define the base API service
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://sared.online:5000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (blogData) => {
        const formData = new FormData();
        Object.keys(blogData).forEach((key) =>
          formData.append(key, blogData[key])
        );
        return {
          url: "/createBlog",
          method: "POST",
          body: formData,
        };
      },
      onQueryStarted: async (args, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          toast.success("Blog created successfully!");
        } catch (error) {
          toast.error("Failed to create blog.");
        }
      },
    }),
    fetchBlogs: builder.query({
      query: () => "/blogs",
      onQueryStarted: async (args, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          toast.error("Failed to fetch blogs.");
        }
      },
    }),
    fetchBlogDetail: builder.query({
      query: (blogId) => `/blogs/${blogId}`,
      onQueryStarted: async (args, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          toast.error("Failed to fetch blog details.");
        }
      },
    }),
    likeBlog: builder.mutation({
      query: (blogId) => ({
        url: `/blogs/${blogId}/like`,
        method: "POST",
      }),
      onQueryStarted: async (args, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          toast.success("Blog liked successfully!");
        } catch (error) {
          toast.error("Failed to like the blog.");
        }
      },
    }),
    saveToFavorites: builder.mutation({
      query: (blogId) => ({
        url: "/users/favorites",
        method: "POST",
        body: { blogId },
      }),
      onQueryStarted: async (args, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          toast.success("Blog added to favorites!");
        } catch (error) {
          toast.error("Failed to save blog to favorites.");
        }
      },
    }),
    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `/blogs/${blogId}`,
        method: "DELETE",
      }),
      onQueryStarted: async (args, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          toast.success("Blog deleted successfully!");
        } catch (error) {
          toast.error("Failed to delete the blog.");
        }
      },
    }),
    editBlog: builder.mutation({
      query: ({ blogId, title, content, image }) => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (image instanceof File) {
          formData.append("image", image, image.name);
        }
        return {
          url: `/blogs/${blogId}`,
          method: "PUT",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      onQueryStarted: async (args, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          toast.success("Blog updated successfully!");
        } catch (error) {
          toast.error("Failed to update the blog.");
        }
      },
    }),
  }),
});

// Export the auto-generated hooks for the endpoints
export const {
  useCreateBlogMutation,
  useFetchBlogsQuery,
  useFetchBlogDetailQuery,
  useLikeBlogMutation,
  useSaveToFavoritesMutation,
  useDeleteBlogMutation,
  useEditBlogMutation,
} = api;

// Create a slice for the additional reducer logic (e.g., addComment)
const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    status: "idle",
    error: null,
    favorites: [],
    comments: [],
  },
  reducers: {
    addComment(state, action) {
      const { blogId, comment } = action.payload;
      const blog = state.blogs.find((blog) => blog.id === blogId);
      if (blog) {
        if (!blog.comments) blog.comments = [];
        blog.comments.push(comment);
      }
    },
  },
  extraReducers: (builder) => {
    // Use extraReducers to handle actions from the RTK Query API slices
    builder
      .addMatcher(api.endpoints.fetchBlogs.matchFulfilled, (state, action) => {
        state.blogs = action.payload;
        state.status = "succeeded";
      })
      .addMatcher(api.endpoints.fetchBlogs.matchPending, (state) => {
        state.status = "loading";
      })
      .addMatcher(api.endpoints.fetchBlogs.matchRejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addMatcher(
        api.endpoints.fetchBlogDetail.matchFulfilled,
        (state, action) => {
          const index = state.blogs.findIndex(
            (blog) => blog.id === action.payload.id
          );
          if (index !== -1) {
            state.blogs[index] = { ...state.blogs[index], ...action.payload };
          } else {
            state.blogs.push(action.payload);
          }
        }
      )
      .addMatcher(api.endpoints.createBlog.matchFulfilled, (state, action) => {
        state.blogs.push(action.payload);
      })
      .addMatcher(api.endpoints.deleteBlog.matchFulfilled, (state, action) => {
        state.blogs = state.blogs.filter((blog) => blog.id !== action.payload);
        state.favorites = state.favorites.filter(
          (blog) => blog.id !== action.payload
        );
      })
      .addMatcher(api.endpoints.editBlog.matchFulfilled, (state, action) => {
        const index = state.blogs.findIndex(
          (blog) => blog.id === action.payload.id
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
      });
  },
});

export const { addComment } = blogSlice.actions;
export const apiReducer = api.reducer;
export default blogSlice.reducer;
