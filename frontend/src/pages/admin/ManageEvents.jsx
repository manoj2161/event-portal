import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { getEvents, deleteEvent, createEvent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Other'];
const emptyForm  = { title: '', description: '', category: 'Tech', venue: '', date: '', maxParticipants: '' };

const ManageEvents = () => {
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [formData, setFormData]   = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await getEvents();
      setEvents(data);
    } catch { toast.error('Failed to load events'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await createEvent(formData);
      setEvents(prev => [data, ...prev]);
      setFormData(emptyForm);
      setShowForm(false);
      toast.success('Event created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents(prev => prev.filter(e => e._id !== id));
      toast.success('Event deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Events</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Create Event'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Create New Event</h3>
          <form onSubmit={handleCreate} className="proposal-form">
            <div className="form-group">
              <label>Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Max Participants</label>
                <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} required min={1} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Venue</label>
                <input type="text" name="venue" value={formData.venue} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Event'}
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th><th>Category</th><th>Venue</th>
              <th>Date</th><th>Participants</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event._id}>
                <td><strong>{event.title}</strong></td>
                <td><span className={`category-badge category-${event.category?.toLowerCase()}`}>{event.category}</span></td>
                <td>{event.venue}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.currentParticipants}/{event.maxParticipants}</td>
                <td>
                  <button onClick={() => handleDelete(event._id)} className="btn-danger-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEvents;
