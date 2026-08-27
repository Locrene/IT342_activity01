import { useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../api/session';
import { Link } from 'react-router-dom';
export default function Dashboard() {
  const user = getSession();
  const navigate = useNavigate();

  function handleLogout() {
    clearSession();
    navigate('/login');
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Dashboard</h1>
        <p>Welcome, {user?.username}!</p>
        <p>User ID: {user?.id}</p>
        <Link to="/requests" className="btn-primary">My Service Requests</Link>
        <button className="btn-primary" onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}