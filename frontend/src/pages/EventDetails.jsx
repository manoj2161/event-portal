import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../services/api';
import { registerForEvent } from '../services/api';
import './EventDetails.css'
const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await getEventById(id);
                setEvent(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvent();
    }, [id]);

    if (!event) return <div>Loading...</div>;
    const handleRegister = async () => {
        try {
            await registerForEvent({
                eventId: event._id
            });

            toast.success('Registered successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        }
    };
    return (
        <div className="container">
            <div className="event-details-card">

                <h1>{event.title}</h1>

                <span className="category-badge">
                    {event.category}
                </span>

                <p className="description">
                    {event.description}
                </p>

                <div className="info">
                    <p>📍 {event.venue}</p>
                    <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                    <p>
                        👥 {event.currentParticipants}/
                        {event.maxParticipants}
                    </p>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleRegister}
                >
                    Register Now
                </button>

            </div>
        </div>
    );
};

export default EventDetails;