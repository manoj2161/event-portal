import { Link } from 'react-router-dom';

const EventCard = ({ event, onRegister, isRegistered }) => {
  const { _id, title, description, category, venue, date, currentParticipants, maxParticipants } = event;
  const isFull = currentParticipants >= maxParticipants;
  const eventDate = new Date(date);
  const isPast = eventDate < new Date();

  return (
    <div className={`event-card ${isPast ? 'past-event' : ''}`}>
      <div className="event-card-header">
        <span className={`category-badge category-${category?.toLowerCase()}`}>{category}</span>
        {isFull && <span className="full-badge">Full</span>}
      </div>
      <h3 className="event-title">{title}</h3>
      <p className="event-description">{description?.slice(0, 100)}...</p>
      <div className="event-meta">
        <span>📍 {venue}</span>
        <span>📅 {eventDate.toLocaleDateString()}</span>
        <span>👥 {currentParticipants}/{maxParticipants}</span>
      </div>
      <div className="event-card-footer">
        <Link to={`/events/${_id}`} className="btn-details">View Details</Link>
        {onRegister && !isPast && (
          <button
            onClick={() => onRegister(_id)}
            disabled={isFull || isRegistered}
            className={`btn-register ${isRegistered ? 'registered' : ''}`}
          >
            {isRegistered ? '✓ Registered' : isFull ? 'Full' : 'Register'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
