import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from './slices/ingredientsSlice/ingredientsSlice';
import { userSlice } from './slices/userSlice/userSlice';
import { constructorSlice } from './slices/constructorSlice/constructorSlice';
import { orderSlice } from './slices/orderSlice/orderSlice';
import { feedSlice } from './slices/feedSlice/feedSlice';

// объединение всех редьюсеров
export const rootReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  feed: feedSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
