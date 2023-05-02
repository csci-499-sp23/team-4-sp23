import { createSlice } from '@reduxjs/toolkit'


const initialAppState = {
  user: null,
  /** @type {"loading"|true|false} */ loggedIn: "loading",
  messageReceiver: null
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
    setMessageReceiver: (state, { payload, }) => {
      state.messageReceiver = payload
    }
  },
});
// Action creators are generated for each case of reducer function, 
// call them inside dispatch to perform the desired action or change ijn the store
export const { login, logout, setMessageReceiver } = appSlice.actions;

export default appSlice.reducer;

/**
 * const user = firebase.getUser())
const action = {type: 'login',payload:user}
dispatch(action)

dipatch(login(user))
*/
