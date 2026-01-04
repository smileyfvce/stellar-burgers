import reducer, { feedThunk, initialState } from './feedSlice';

jest.mock('../../../utils/burger-api', () => ({
  getFeedsApi: jest.fn(() =>
    Promise.resolve({ orders: [], total: 0, totalToday: 0 })
  )
}));

describe('тест редьюсера feedSlice', () => {
  describe('асинхронный экшен feedThunk', () => {
    test('request => isLoading: true', () => {
      const action = { type: feedThunk.pending.type };
      const state = reducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('success => сохранение данных, isLoading: false', () => {
      const mockFeed = {
        orders: [{ _id: '1', number: 12345 }],
        total: 100,
        totalToday: 10
      };

      const action = {
        type: feedThunk.fulfilled.type,
        payload: mockFeed
      };

      const pendingState = reducer(initialState, {
        type: feedThunk.pending.type
      });

      const state = reducer(pendingState, action);

      expect(state.orders).toHaveLength(1);
      expect(state.orders[0]._id).toBe('1');
      expect(state.totalAll).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('экшен failed => сохранение ошибки, isLoading: false', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';

      const action = {
        type: feedThunk.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = reducer(initialState, {
        type: feedThunk.pending.type
      });

      const state = reducer(pendingState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });
});
