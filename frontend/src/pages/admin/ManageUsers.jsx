import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { getAllUsers, deleteUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const { user: currentUser } = useAuth();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers();
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (id === currentUser._id) return toast.error("Can't delete yourself");
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete user'); }
  };

  if (loading) return <Loader />;

  const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Users</h1>
        <div className="role-filters">
          {['all', 'student', 'organizer', 'admin'].map(r => (
            <button
              key={r} onClick={() => setFilter(r)}
              className={`filter-btn ${filter === r ? 'active' : ''}`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u._id}>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  {u._id !== currentUser._id && (
                    <button onClick={() => handleDelete(u._id)} className="btn-danger-sm">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
