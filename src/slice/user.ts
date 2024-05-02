import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserState {
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  money: number;
}

const initialState: UserState = {
  name: '',
  email: '',
  accessToken: '',
  refreshToken: '',
  money: 0,
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
    setMoney(state, action: PayloadAction<number>) {
      state.money = action.payload;
    },
    setAccesToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    setReset(state) {
      state.accessToken = '';
      state.email = '';
      state.name = '';
      state.refreshToken = '';
    },
  },
});
