import { createSlice } from '@reduxjs/toolkit'


const initialAppState = {
  user: null,
  /** @type {"loading"|true|false} */ loggedIn: "loading",
};

export const appSlice = createSlice({
  name: "counter",
  initialState: initialAppState,
  reducers: {
    login: (state, action) => {
      //set to null if no user or logged out
      state.user = action.payload;
      state.loggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.loggedIn = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = appSlice.actions;

export default appSlice.reducer;
