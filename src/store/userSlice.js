// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",

  initialState: {
    userDetails: {},
    token: null,
    isAuth: false,
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setUserToken: (state, action) => {
      state.token = action.payload;
      state.isAuth = Boolean(action.payload);
    },
    clearUserToken: (state) => {
      state.token = null;
      state.isAuth = false;
    },
    clearUserDetails: (state) => {
      state.userDetails = {};
    },
  },
});

export const {
  setUserDetails,
  setUserToken,
  clearUserToken,
  clearUserDetails,
} = userSlice.actions;
export default userSlice.reducer;
