import reducer, { ordersThunk, orderThunk, initialState } from './orderSlice';

jest.mock('../../../utils/burger-api', () => ({
  getOrdersApi: jest.fn(() => Promise.resolve([])),
  getOrderByNumberApi: jest.fn(() => Promise.resolve({ orders: [] }))
}));

describe('тест редьюсера orderSlice', () => {
  describe('асинхронный экшен ordersThunk', () => {
    test('экшен request, isLoading = true', () => {
      const action = { type: ordersThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('экшен success, сохранение данных, isLoading = false', () => {
      const mockOrders = [
        {
          _id: '1',
          number: 12345,
          status: 'pending' as const,
          ingredients: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          number: 12346,
          status: 'done' as const,
          ingredients: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      const action = {
        type: ordersThunk.fulfilled.type,
        payload: mockOrders
      };

      const pendingState = reducer(initialState, {
        type: ordersThunk.pending.type
      });

      const state = reducer(pendingState, action);

      expect(state.orders).toEqual(mockOrders);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('экшен failed, ошибка сохраняется, isLoading = false', () => {
      const errorMessage = 'Ошибка при загрузке заказов';

      const action = {
        type: ordersThunk.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = reducer(initialState, {
        type: ordersThunk.pending.type
      });

      const state = reducer(pendingState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('асинхронный экшен orderThunk', () => {
    test('request => isLoading: true', () => {
      const action = { type: orderThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('success => сохранение данных, isLoading: false', () => {
      const mockOrder = {
        _id: '1',
        number: 12345,
        status: 'created' as const,
        ingredients: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const action = {
        type: orderThunk.fulfilled.type,
        payload: { orders: [mockOrder] }
      };

      const pendingState = reducer(initialState, {
        type: orderThunk.pending.type
      });

      const state = reducer(pendingState, action);

      expect(state.order).toEqual(mockOrder);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('failed => ошибка сохраняется, isLoading: false', () => {
      const errorMessage = 'Ошибка при загрузке заказа';

      const action = {
        type: orderThunk.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = reducer(initialState, {
        type: orderThunk.pending.type
      });

      const state = reducer(pendingState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });
});
