import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
//+
export interface IFeedState {
  orders: TOrder[];
  totalAll: number; // всего заказов
  total: number; // заказов сегодня
  isLoading: boolean;
  error: string | null;
}

const initialState: IFeedState = {
  orders: [],
  totalAll: 0,
  total: 0,
  isLoading: false,
  error: null
};

// Thunk для получения ленты заказов
export const feedThunk = createAsyncThunk('feed/fetch', getFeedsApi);

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
        state.total = action.payload.total;
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
    selectorFeedTotal: (state) => state.total
  }
});

export const {
  selectorFeedState,
  selectorFeedData,
  selectorFeedTotalAll,
  selectorFeedTotal
} = feedSlice.selectors;

export default feedSlice.reducer;
