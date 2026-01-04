import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useDispatch } from '../../services/store';
import { getUserThunk } from '../../services/slices/userSlice/userSlice';
import { ingredientsThunk } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import { ProtectedRoute } from '../../services/ProtectedRoute';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const feedMatch = useMatch('/feed/:number');
  const profileMatch = useMatch('/profile/orders/:number');
  const orderNumber =
    feedMatch?.params.number || profileMatch?.params.number || '';
  const background = (location.state as { background?: Location })?.background;
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      dispatch(getUserThunk());
      dispatch(ingredientsThunk());
    }
  }, [dispatch]);

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* только для неавторизованных */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* только для авторизованных */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* страница 404 */}
        <Route path='*' element={<NotFound404 />} />

        {/* динамические маршруты для прямого перехода */}
        <Route
          path='/feed/:number'
          element={
            <div className={styles.app}>
              <OrderInfo />
            </div>
          }
        />
        <Route
          path='/ingredients/:id'
          element={
            <div className={styles.app}>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <div className={styles.app}>
              <ProtectedRoute>
                <OrderInfo />
              </ProtectedRoute>
            </div>
          }
        />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${orderNumber.padStart(6, '0')}`}
                onClose={closeModal}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${orderNumber.padStart(6, '0')}`}
                onClose={closeModal}
              >
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
