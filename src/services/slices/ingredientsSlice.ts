import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '@api';

type TIngredientsState = {
  items: TIngredient[]; // массив ингредиентов
  isLoading: boolean; // флаг загрузки
  error: string | null; // текст ошибки
};

// начальные значения
const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/items',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredientsState: (state) => state,
    selectIngredientsData: (state) => state.items
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true; // включаем загрузку
        state.error = null; // очищаем ошибки
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false; // выключаем загрузку
        state.items = action.payload; // сохраняем данные
        state.error = null; // очищаем ошибки
      });
  }
});

// Экспортируем редюсер по умолчанию
export default ingredientsSlice.reducer;

// Экспортируем селекторы из слайса
export const { selectIngredientsState, selectIngredientsData } =
  ingredientsSlice.selectors;
