import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';
import { getAdminStats, getProposals, approveProposal, rejectProposal } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats]         = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [actionNote, setActionNote] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [statsRes, proposalsRes] = await Promise.all([getAdminStats(), getProposals()]);
      setStats(statsRes.data);
      setProposals(proposalsRes.data.filter(p => p.status === 'Pending'));
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveProposal(id, { adminNote: actionNote });
      toast.success('Proposal approved & event created!');
      setProposals(prev => prev.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, pendingProposals: prev.pendingProposals - 1, totalEvents: prev.totalEvents + 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectProposal(id, { adminNote: actionNote });
      toast.info('Proposal rejected');
      setProposals(prev => prev.filter(p => p._id !== id));
      setStats(prev => ({ ...prev, pendingProposals: prev.pendingProposals - 1 }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage the entire Event Portal</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon="🎉" label="Total Events"       value={stats?.totalEvents}       color="#4f46e5" />
        <StatCard icon="👥" label="Total Users"        value={stats?.totalUsers}        color="#059669" />
        <StatCard icon="⏳" label="Pending Proposals"  value={stats?.pendingProposals}  color="#d97706" />
        <StatCard icon="📝" label="Registrations"      value={stats?.totalRegistrations} color="#7c3aed" />
        <StatCard icon="🎓" label="Students"           value={stats?.studentCount}      color="#0891b2" />
        <StatCard icon="🏢" label="Organizers"         value={stats?.organizerCount}    color="#be185d" />
      </div>

      {/* Quick Links */}
      <div className="quick-links">
        <Link to="/admin/events"    className="quick-link-card">📅 Manage Events</Link>
        <Link to="/admin/users"     className="quick-link-card">👤 Manage Users</Link>
        <Link to="/admin/proposals" className="quick-link-card">📋 All Proposals</Link>
      </div>

      {/* Pending Proposals */}
      <div className="dashboard-section">
        <h2>Pending Proposals ({proposals.length})</h2>
        {proposals.length === 0 ? (
          <div className="empty-state"><p>No pending proposals.</p></div>
        ) : (
          <div className="proposals-list">
            {proposals.map(p => (
              <div key={p._id} className="proposal-item admin-proposal">
                <div className="proposal-info">
                  <h3>{p.title}</h3>
                  <p>By: <strong>{p.organizerId?.name}</strong> &nbsp;|&nbsp; 📍 {p.venue} &nbsp;|&nbsp; 📅 {new Date(p.date).toLocaleDateString()}</p>
                  <p className="proposal-desc">{p.description?.slice(0, 120)}...</p>
                </div>
                <div className="proposal-actions">
                  <input
                    type="text"
                    placeholder="Optional note..."
                    className="note-input"
                    onChange={e => setActionNote(e.target.value)}
                  />
                  <button onClick={() => handleApprove(p._id)} className="btn-approve">✓ Approve</button>
                  <button onClick={() => handleReject(p._id)}  className="btn-reject">✗ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
