import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import EventDetails from './pages/EventDetails';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './components/Navbar';

// Public Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import ProposalForm from './pages/organizer/ProposalForm';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageEvents from './pages/admin/ManageEvents';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>

          {/* ── Public ── */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Student ── */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>

          {/* ── Organizer ── */}
          <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/organizer/proposals/new" element={<ProposalForm />} />
            <Route path="/organizer/proposals/edit/:id" element={<ProposalForm />} />
          </Route>

          {/* ── Admin ── */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<ManageEvents />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          {/* ── Fallbacks ── */}
          <Route path="/unauthorized" element={<div style={{ textAlign: 'center', padding: '4rem' }}><h2>⛔ Access Denied</h2><p>You don't have permission to view this page.</p></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
