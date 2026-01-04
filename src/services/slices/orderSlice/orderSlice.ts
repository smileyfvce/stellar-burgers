import { getOrderByNumberApi, getOrdersApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface IOrderState {
  orders: TOrder[];
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: IOrderState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null
};

export const ordersThunk = createAsyncThunk('feed/orders', getOrdersApi);

export const orderThunk = createAsyncThunk(
  'feed/order',
  async (order: number) => await getOrderByNumberApi(order)
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // получение заказов
      .addCase(ordersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(ordersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(ordersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      })
      // получение конкретного заказа
      .addCase(orderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(orderThunk.fulfilled, (state, action) => {
        state.order = action.payload.orders[0];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(orderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      });
  },
  selectors: {
    selectorOrderState: (state) => state,
    selectorOrders: (state) => state.orders,
    selectorOrder: (state) => state.order
  }
});

export const { selectorOrderState, selectorOrders, selectorOrder } =
  orderSlice.selectors;

export default orderSlice.reducer;
