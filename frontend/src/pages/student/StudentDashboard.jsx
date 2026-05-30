import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import { getMyRegistrations, cancelRegistration } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { fetchRegistrations(); }, []);

  const fetchRegistrations = async () => {
    try {
      const { data } = await getMyRegistrations();
      setRegistrations(data);
    } catch {
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this registration?')) return;
    try {
      await cancelRegistration(id);
      toast.success('Registration cancelled');
      setRegistrations(prev => prev.map(r =>
        r._id === id ? { ...r, status: 'Cancelled' } : r
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <Loader />;

  const confirmed  = registrations.filter(r => r.status === 'Confirmed');
  const upcoming   = confirmed.filter(r => new Date(r.eventId?.date) >= new Date());
  const past       = confirmed.filter(r => new Date(r.eventId?.date) < new Date());

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Welcome, {user?.name} 👋</h1>
        <p>Your student dashboard</p>
      </div>

      <div className="stats-grid">
        <StatCard icon="📝" label="Total Registrations" value={registrations.length} color="#4f46e5" />
        <StatCard icon="🎯" label="Upcoming Events"     value={upcoming.length}      color="#059669" />
        <StatCard icon="✅" label="Attended Events"     value={past.length}          color="#d97706" />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Registrations</h2>
          <Link to="/events" className="btn-primary">Browse Events</Link>
        </div>

        {registrations.length === 0 ? (
          <div className="empty-state">
            <p>You haven't registered for any events yet.</p>
            <Link to="/events" className="btn-primary">Explore Events</Link>
          </div>
        ) : (
          <div className="registrations-list">
            {registrations.map(reg => {
              const event = reg.eventId;
              const isPast = event && new Date(event.date) < new Date();
              return (
                <div key={reg._id} className={`registration-item ${reg.status === 'Cancelled' ? 'cancelled' : ''}`}>
                  <div className="reg-info">
                    <h3>{event?.title || 'Event Removed'}</h3>
                    <p>📍 {event?.venue} &nbsp;|&nbsp; 📅 {event ? new Date(event.date).toLocaleDateString() : '-'}</p>
                    <span className={`status-badge status-${reg.status?.toLowerCase()}`}>{reg.status}</span>
                  </div>
                  {reg.status === 'Confirmed' && !isPast && (
                    <button onClick={() => handleCancel(reg._id)} className="btn-cancel">Cancel</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
