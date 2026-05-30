import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import { getProposals } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OrganizerDashboard = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { fetchProposals(); }, []);

  const fetchProposals = async () => {
    try {
      const { data } = await getProposals();
      setProposals(data);
    } catch {
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  const pending  = proposals.filter(p => p.status === 'Pending');
  const approved = proposals.filter(p => p.status === 'Approved');
  const rejected = proposals.filter(p => p.status === 'Rejected');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Organizer Dashboard</h1>
        <p>Welcome, {user?.name}</p>
      </div>

      <div className="stats-grid">
        <StatCard icon="📋" label="Total Proposals" value={proposals.length} color="#4f46e5" />
        <StatCard icon="⏳" label="Pending"          value={pending.length}   color="#d97706" />
        <StatCard icon="✅" label="Approved"         value={approved.length}  color="#059669" />
        <StatCard icon="❌" label="Rejected"         value={rejected.length}  color="#dc2626" />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>My Proposals</h2>
          <Link to="/organizer/proposals/new" className="btn-primary">+ New Proposal</Link>
        </div>

        {proposals.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any proposals yet.</p>
            <Link to="/organizer/proposals/new" className="btn-primary">Submit First Proposal</Link>
          </div>
        ) : (
          <div className="proposals-list">
            {proposals.map(p => (
              <div key={p._id} className="proposal-item">
                <div className="proposal-info">
                  <h3>{p.title}</h3>
                  <p>📍 {p.venue} &nbsp;|&nbsp; 📅 {new Date(p.date).toLocaleDateString()}</p>
                  {p.adminNote && <p className="admin-note">📝 Admin: {p.adminNote}</p>}
                </div>
                <div className="proposal-actions">
                  <span className={`status-badge status-${p.status?.toLowerCase()}`}>{p.status}</span>
                  {p.status === 'Pending' && (
                    <Link to={`/organizer/proposals/edit/${p._id}`} className="btn-edit">Edit</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
