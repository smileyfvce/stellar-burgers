import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../../utils/types';
import { getIngredientsApi } from '../../../utils/burger-api';

export interface IIngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

export const initialState: IIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const ingredientsThunk = createAsyncThunk(
  'ingredients/items',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectorIngredientsState: (state) => state,
    selectorIngredientsData: (state) => state.ingredients
  },
  extraReducers: (builder) => {
    builder
      .addCase(ingredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(ingredientsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.error = null;
      })
      .addCase(ingredientsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const { selectorIngredientsState, selectorIngredientsData } =
  ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
