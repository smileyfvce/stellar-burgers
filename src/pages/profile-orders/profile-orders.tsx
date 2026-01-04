import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  ordersThunk,
  selectorOrders
} from '../../services/slices/orderSlice/orderSlice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectorOrders);

  useEffect(() => {
    dispatch(ordersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
