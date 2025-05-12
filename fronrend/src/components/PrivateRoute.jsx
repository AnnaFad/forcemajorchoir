// Компонента для ограничения доступа к определенным страницам
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('accessToken');

  return token ? children : <Navigate to="/admin-auth" replace />;
}