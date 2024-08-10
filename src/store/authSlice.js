import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { setUserDetails, setUserToken } from "./userSlice";

const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_DOMAIN}/api`,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = getState().user.token;
      if (token && endpoint !== "getUserByEmail" && endpoint !== "login") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data.userDetails) {
            dispatch(setUserDetails(data.userDetails)); // Store user details
          }
          if (data.token) {
            dispatch(setUserToken(data.token));
          }
          toast.success("Login successful!");
        } catch (error) {
          toast.error("Failed to authenticate.");
        }
      },
    }),
    getUserByEmail: builder.query({
      query: (email) => ({
        url: "/user/getUserByMail",
        method: "POST",
        body: { email },
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(setUserDetails(data));
          }
        } catch (error) {
          toast.error("Failed to fetch user details.");
        }
      },
    }),

    registerUserWithOTP: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.userDetails) {
            dispatch(setUserDetails(data.userDetails)); // Store user details
          }
          if (data.token) {
            dispatch(setUserToken(data.token));
          }
          dispatch(userApi.util.invalidateTags(["User"]));
          // dispatch(userApi.endpoints.generateOTP.initiate(arg.email));
          toast.success("User registered successfully!");
        } catch (error) {
          toast.error("Failed to register user.");
        }
      },
    }),
    generateOTP: builder.mutation({
      query: (email) => ({
        url: "/user/generateOTP",
        method: "POST",
        body: { email },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast.success("OTP has been sent to your email!");
        } catch (error) {
          toast.error("Problem while generating OTP!");
        }
      },
    }),
    verifyOTP: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/user/verifyOTP",
        method: "POST",
        body: { email, otp },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast.success("OTP verified successfully!");
        } catch (error) {
          toast.error("Wrong OTP! Check email again!");
        }
      },
    }),
    resetPassword: builder.mutation({
      query: ({ email, password }) => ({
        url: "/user/resetPassword",
        method: "PUT",
        body: { email, password },
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast.success("Password reset successfully!");
        } catch (error) {
          toast.error("Failed to reset password.");
        }
      },
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/user/update",
        method: "PUT",
        body: userData,
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast.success("Profile updated successfully!");
        } catch (error) {
          toast.error("Failed to update profile.");
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserByEmailQuery,
  useRegisterUserWithOTPMutation,
  useGenerateOTPMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useUpdateUserMutation,
} = userApi;

export default userApi;
