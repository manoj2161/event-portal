import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import {
  getEvents,
  getMyRegistrations,
  registerForEvent
} from "../services/api";
import { useAuth } from "../context/AuthContext";
const CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Other'];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
    if (user?.role === 'student') fetchMyRegistrations();
  }, [category, user]);

  const fetchEvents = async () => {
    try {
      const params = {};

      if (category !== "All") {
        params.category = category;
      }

      if (search) {
        params.search = search;
      }

      console.log("params:", params);

      const { data } = await getEvents(params);

      console.log("EVENTS DATA:", data);

      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };
  const fetchMyRegistrations = async () => {
    const { data } = await getMyRegistrations();
    console.log("REGISTRATIONS DATA:", data);
    console.log("IS ARRAY?", Array.isArray(data));
    setMyRegistrations(data.map(r => r.eventId?._id));
    try {
      const { data } = await getMyRegistrations();
      setMyRegistrations(data.map(r => r.eventId?._id));
    } catch { }
  };

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent({ eventId });
      toast.success('Successfully registered!');
      setMyRegistrations(prev => [...prev, eventId]);
      setEvents(prev => prev.map(e =>
        e._id === eventId ? { ...e, currentParticipants: e.currentParticipants + 1 } : e
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Discover and register for events happening on campus</p>
      </div>

      {/* Search & Filter */}
      <div className="events-controls">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="category-filters">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="empty-state">
          <p>No events found. Check back later!</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <EventCard
              key={event._id}
              event={event}
              onRegister={user?.role === 'student' ? handleRegister : null}
              isRegistered={myRegistrations.includes(event._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
