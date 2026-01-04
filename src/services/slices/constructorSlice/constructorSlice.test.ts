import reducer, { 
  addIngredient, 
  removeIngredient,
  moveUp,
  moveDown,
  initialState 
} from "./constructorSlice"

const mockBun = {
  _id: 'bun-id',
  name: 'Булка',
  type: 'bun' as const,
  price: 1000
}

const mockMain = {
  _id: 'main-id', 
  name: 'Начинка',
  type: 'main' as const,
  price: 500
}

describe('тест редьюсера constructorSlice', () => {
  describe('экшен добавления ингредиента', () => {
    test('добавление булки', () => {
      const action = addIngredient(mockBun);
      const state = reducer(initialState, action);

      expect(state.burgerConstructor.bun?._id).toBe(mockBun._id);
      expect(state.burgerConstructor.bun?.name).toBe(mockBun.name);
      expect(state.burgerConstructor.bun?.id).toBeDefined();
    })
    test('добавление начинки', () => {
      const action = addIngredient(mockMain);
      const state = reducer(initialState, action);
      
      expect(state.burgerConstructor.ingredients).toHaveLength(1);
      expect(state.burgerConstructor.ingredients[0]._id).toBe(mockMain._id);
      expect(state.burgerConstructor.ingredients[0].id).toBeDefined();
    })
  })
  describe('экшен удаления ингредиента', () => {
    test('удаление начинки', () => {
      let state = reducer(initialState, addIngredient(mockMain));

      expect(state.burgerConstructor.ingredients).toHaveLength(1);

      const ingredientToRemove = state.burgerConstructor.ingredients[0];
      const action = removeIngredient({ id: ingredientToRemove.id });
      state = reducer(state, action);
      
      expect(state.burgerConstructor.ingredients).toHaveLength(0);
    })
  })

  describe('экшен изменения порядка ингредиентов', () => {
    test('перемещение ингредиента вверх', () => {
      const main1 = { ...mockMain, _id: '1', name: 'Первая' };
      const main2 = { ...mockMain, _id: '2', name: 'Вторая' };
      let state = reducer(initialState, addIngredient(main1));
      state = reducer(state, addIngredient(main2));
      const initialOrder = state.burgerConstructor.ingredients.map(item => item._id);

      expect(initialOrder).toEqual(['1', '2']);
      
      const action = moveUp(1);
      state = reducer(state, action);
      const newOrder = state.burgerConstructor.ingredients.map(item => item._id);

      expect(newOrder).toEqual(['2', '1']);
    })

    test('перемещение ингредиента вниз', () => {
      const main1 = { ...mockMain, _id: '1', name: 'Первая' };
      const main2 = { ...mockMain, _id: '2', name: 'Вторая' };
      
      let state = reducer(initialState, addIngredient(main1));
      state = reducer(state, addIngredient(main2));
      const initialOrder = state.burgerConstructor.ingredients.map(item => item._id);

      expect(initialOrder).toEqual(['1', '2']);
      
      const action = moveDown(0);
      state = reducer(state, action);
      const newOrder = state.burgerConstructor.ingredients.map(item => item._id);

      expect(newOrder).toEqual(['2', '1']);
    })
  })
})