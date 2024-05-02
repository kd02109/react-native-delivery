import {orderSlice} from '@/slice/order';
import {userSlice} from '@/slice/user';
import {combineReducers} from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
});
