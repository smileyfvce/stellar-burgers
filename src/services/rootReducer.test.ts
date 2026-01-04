import { rootReducer } from './store'

describe('тест rootReducer', ()=> {
  test('возвращаем правильное начальное состояние', () => {
    const state = rootReducer(undefined, {type: 'UNKNOWN_ACTION'})
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');
  })})
