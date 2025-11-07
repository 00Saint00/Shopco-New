import { createSlice } from "@reduxjs/toolkit";

// Initial state - what your auth state looks like at the start
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// Create the slice
const authSlice = createSlice({
  name: "auth", // name of the slice
  initialState,
  reducers: {
    // Actions that update the state
    login: (state, action) => {
      // action.payload will contain { user, token }
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      // Update user info (like in ProfileInfo)
      state.user = { ...state.user, ...action.payload };
    },

    loadUserFromStorage: (state, action) => {
        // action.payload will be { user, token }
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = !!action.payload.user;
        }
      },
  },
});

// Export the actions so components can use them
export const { login, logout, updateUser, loadUserFromStorage } = authSlice.actions;

// Export the reducer so store can use it
export default authSlice.reducer;