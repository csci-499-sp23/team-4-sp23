import { createSlice } from '@reduxjs/toolkit'


const initialAppState = {
  user: null,
  /** @type {"loading"|true|false} */ loggedIn: "loading",
  messageReceiver: null,
  profilesInConversations: [],
  /** @type {import('../..').Profile} */
  hostProfile: null
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
    },
    newProfileMessageNotification: (state, { payload }) => {
      // {profiles,newConversation=false}
      const profile = state.profilesInConversations[payload.email] ?? payload.timestamp
      profile.newConversation = true;
    },
    clearProfileMessageNotification: (state, { payload }) => {
      state.profilesInConversations[payload.email].notify = null
    },
    setHostProfile: (state, { payload }) => {
      state.hostProfile = payload
    }

  },
});
// Action creators are generated for each case of reducer function, 
// call them inside dispatch to perform the desired action or change ijn the store
export const { login, logout, setMessageReceiver, newProfileMessageNotification, clearProfileMessageNotification, setHostProfile } = appSlice.actions;

export default appSlice.reducer;

/**
 * const user = firebase.getUser())
const action = {type: 'login',payload:user}
dispatch(action)

dipatch(login(user))
*/
