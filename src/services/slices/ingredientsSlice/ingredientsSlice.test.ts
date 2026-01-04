import reducer, { ingredientsThunk, initialState } from './ingredientsSlice';

jest.mock('../../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn(() => Promise.resolve([]))
}));

describe('тест редьюсера ingredientsSlice', () => {
  describe('асинхронный экшен ingredientsThunk', () => {
    test('request => isLoading: true', () => {
      const action = { type: ingredientsThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('success => сохранение данных, isLoading: false ', () => {
      const mockIngredients = [
        {
          _id: 'bun-id',
          name: 'Булка',
          type: 'bun' as const,
          price: 50
        },
        {
          _id: 'main-id',
          name: 'Начинка',
          type: 'main' as const,
          price: 100
        }
      ];

      const action = {
        type: ingredientsThunk.fulfilled.type,
        payload: mockIngredients
      };
      const pendingState = reducer(initialState, {
        type: ingredientsThunk.pending.type
      });
      const state = reducer(pendingState, action);

      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('failed => ошибка сохраняется, isLoading: false', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';

      const action = {
        type: ingredientsThunk.rejected.type,
        error: errorMessage
      };
      const pendingState = reducer(initialState, {
        type: ingredientsThunk.pending.type
      });
      const state = reducer(pendingState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });
});
