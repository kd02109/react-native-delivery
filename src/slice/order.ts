import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Order} from '@/type';

export type InitialState = {
  orders: Order[];
  deliveries: Order[];
};

const initialState: InitialState = {
  orders: [],
  deliveries: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceptOrder(state, action: PayloadAction<string>) {
      const id = action.payload;
      const accept = state.orders.find(order => order.orderId === id);
      if (accept) {
        state.deliveries.push(accept);
        state.orders = state.orders.filter(order => order.orderId !== id);
      }
    },
    rejectOrder(state, action: PayloadAction<string>) {
      state.orders = state.orders.filter(
        order => order.orderId !== action.payload,
      );
      state.deliveries = state.deliveries.filter(
        order => order.orderId !== action.payload,
      );
    },
  },
});
