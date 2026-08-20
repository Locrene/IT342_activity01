import { Navigate } from 'react-router-dom';
import { getSession } from '../api/session';

export default function ProtectedRoute({ children }) {
  const user = getSession();
  return user ? children : <Navigate to="/login" />;
}