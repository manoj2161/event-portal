import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Account created successfully!');
      if (user.role === 'organizer') navigate('/organizer/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join the Event Portal</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text" name="name"
              value={formData.name} onChange={handleChange}
              placeholder="John Doe" required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email" name="email"
              value={formData.email} onChange={handleChange}
              placeholder="you@example.com" required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" name="password"
              value={formData.password} onChange={handleChange}
              placeholder="Min 6 characters" required minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Register As</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="organizer">Event Organizer</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
