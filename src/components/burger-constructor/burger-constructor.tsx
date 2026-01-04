import { FC, useMemo } from 'react';
import { BurgerConstructorUI } from '../ui/burger-constructor';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { selectorIsAuth } from '../../services/slices/userSlice/userSlice';
import {
  burgerThunk,
  clearOrderModalData,
  selectorConstructorData,
  selectorOrderModalData,
  selectorOrderRequest,
  setRequest
} from '../../services/slices/constructorSlice/constructorSlice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuth = useSelector(selectorIsAuth);
  const constructorItems = useSelector(selectorConstructorData);
  const orderRequest = useSelector(selectorOrderRequest);
  const orderModalData = useSelector(selectorOrderModalData);

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;
    const order = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      constructorItems.bun._id
    ].filter(Boolean);
    dispatch(burgerThunk(order));
  };

  const closeOrderModal = () => {
    dispatch(setRequest(false));
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
