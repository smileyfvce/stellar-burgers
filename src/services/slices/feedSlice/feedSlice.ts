import { getFeedsApi } from '../../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface IFeedState {
  orders: TOrder[];
  totalToday: number;
  totalAll: number;
  isLoading: boolean;
  error: string | null;
}

export const initialState: IFeedState = {
  orders: [],
  totalToday: 0,
  totalAll: 0,
  isLoading: false,
  error: null
};

export const feedThunk = createAsyncThunk('/orders/all', getFeedsApi);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(feedThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.totalAll = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(feedThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      });
  },
  selectors: {
    selectorFeedState: (state) => state,
    selectorFeedData: (state) => state.orders,
    selectorFeedTotalAll: (state) => state.totalAll,
    selectorFeedTotalToday: (state) => state.totalToday
  }
});

export const {
  selectorFeedState,
  selectorFeedData,
  selectorFeedTotalAll,
  selectorFeedTotalToday
} = feedSlice.selectors;

export default feedSlice.reducer;
