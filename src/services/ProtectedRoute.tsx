import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from './store';
import {
  selectorIsAuthCheck,
  selectorUserData
} from './slices/userSlice/userSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  onlyAuth?: boolean; // неавторизован = true
  children: React.ReactElement;
}

export const ProtectedRoute = ({
  onlyAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthCheck = useSelector(selectorIsAuthCheck);
  const user = useSelector(selectorUserData);
  const isAuth = Boolean(user);

  if (!isAuthCheck) {
    return <Preloader />;
  }

  if (onlyAuth && isAuth) {
    const redirect = location.state?.from || { pathname: '/' };
    return <Navigate to={redirect} replace />;
  }
  if (!onlyAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
