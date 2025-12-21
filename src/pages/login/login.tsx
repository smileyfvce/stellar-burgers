import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  loginThunk,
  selectorIsAuth,
  selectorUserError
} from '../../services/slices/userSlice';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isAuth = useSelector(selectorIsAuth);
  const error = useSelector(selectorUserError);

  if (isAuth) {
    return <Navigate to={'/'} />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    if (!email || !password) return;
    dispatch(loginThunk({ email, password }));
    e.preventDefault();
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
