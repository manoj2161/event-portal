import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin')     return '/admin/dashboard';
    if (user.role === 'organizer') return '/organizer/dashboard';
    return '/student/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎓 EventPortal</Link>
      </div>
      <div className="navbar-links">
        <Link to="/events">Events</Link>
        {user ? (
          <>
            <Link to={getDashboardLink()}>Dashboard</Link>
            <span className="user-role-badge">{user.role}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
