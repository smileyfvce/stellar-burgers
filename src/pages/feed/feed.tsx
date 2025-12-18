import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectorOrders } from '../../services/slices/orderSlice';
import { feedThunk } from '../../services/slices/feedSlice';
//+
export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectorOrders);
  if (!orders.length) {
    return <Preloader />;
  }

  <FeedUI
    orders={orders}
    handleGetFeeds={() => {
      dispatch(feedThunk);
    }}
  />;
};
