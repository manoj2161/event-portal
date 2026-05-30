import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/register';
    if (user.role === 'admin')     return '/admin/dashboard';
    if (user.role === 'organizer') return '/organizer/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="home-page">
      <div className="hero">
        <h1>🎓 Event Portal</h1>
        <p>Discover, organize, and participate in university events with ease.</p>
        <div className="hero-buttons">
          <Link to="/events" className="btn-primary btn-large">Browse Events</Link>
          <Link to={getDashboardLink()} className="btn-secondary btn-large">
            {user ? 'Go to Dashboard' : 'Get Started'}
          </Link>
        </div>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <span className="feature-icon">🎯</span>
          <h3>For Students</h3>
          <p>Register for events, track your participation, and never miss out.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🏢</span>
          <h3>For Organizers</h3>
          <p>Submit event proposals and manage your events in one place.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⚙️</span>
          <h3>For Admins</h3>
          <p>Approve proposals, manage users, and oversee the entire portal.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
