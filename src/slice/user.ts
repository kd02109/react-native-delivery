import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserState {
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

const initialState: UserState = {
  name: '',
  email: '',
  accessToken: '',
  refreshToken: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: builder => {},
});
