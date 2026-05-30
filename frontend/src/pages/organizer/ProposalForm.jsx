import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProposal, updateProposal, getProposalById } from '../../services/api';

const CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Other'];

const ProposalForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Tech',
    venue: '', date: '', maxParticipants: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    try {
      const { data } = await getProposalById(id);
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        venue: data.venue,
        date: data.date?.split('T')[0],
        maxParticipants: data.maxParticipants,
      });
    } catch {
      toast.error('Failed to load proposal');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updateProposal(id, formData);
        toast.success('Proposal updated!');
      } else {
        await createProposal(formData);
        toast.success('Proposal submitted!');
      }
      navigate('/organizer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{isEditing ? 'Edit Proposal' : 'Submit Event Proposal'}</h1>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="proposal-form">
          <div className="form-group">
            <label>Event Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Annual Tech Fest 2025" />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Describe the event..." />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Max Participants *</label>
              <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} required min={1} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Venue *</label>
              <input type="text" name="venue" value={formData.venue} onChange={handleChange} required placeholder="e.g. Main Auditorium" />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Proposal' : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalForm;
