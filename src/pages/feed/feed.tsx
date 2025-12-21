import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedThunk, selectorFeedData } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectorFeedData);

  const handleGetFeeds = useCallback(() => {
    dispatch(feedThunk());
  }, [dispatch]);

  useEffect(() => {
    handleGetFeeds();
  }, [handleGetFeeds]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
