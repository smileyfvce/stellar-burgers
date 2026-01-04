import reducer, {
  registerThunk,
  initialState
} from './userSlice';

jest.mock('../../../utils/burger-api', () => ({
  registerUserApi: jest.fn(() => Promise.resolve({ 
    user: { email: 'test@example.com', name: 'Test Name' },
    accessToken: 'token',
    refreshToken: 'ref-token'
  }))
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('тест редьюсера userSlice', () => {
  describe('асинхронный экшен registerThunk', () => {
    test('request => isLoading: true', () => {
      const action = { type: registerThunk.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('success => сохранение данных пользователя, isLoading: false, isAuth: true', () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test Name'
      };

      const action = {
        type: registerThunk.fulfilled.type,
        payload: mockUser
      };

      const pendingState = reducer(initialState, {
        type: registerThunk.pending.type
      });

      const state = reducer(pendingState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    test('failed => ошибка сохраняется, isLoading: false', () => {
      const errorMessage = 'Ошибка регистрации';

      const action = {
        type: registerThunk.rejected.type,
        error: { message: errorMessage }
      };

      const pendingState = reducer(initialState, {
        type: registerThunk.pending.type
      });

      const state = reducer(pendingState, action);

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });
});