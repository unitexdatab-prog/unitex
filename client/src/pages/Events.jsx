import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiPlus } from 'react-icons/fi';

const Events = () => {
    const { getAuthHeader } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        eventDate: '',
        location: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('/api/events?upcoming=true');
            setEvents(await response.json());
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(newEvent)
            });
            const event = await response.json();
            setEvents([event, ...events]);
            setShowCreate(false);
            setNewEvent({ title: '', description: '', eventDate: '', location: '' });
        } catch (error) {
            console.error('Failed to create event:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center p-6">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1>Events</h1>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowCreate(!showCreate)}
                    className="btn btn-primary"
                >
                    <FiPlus size={18} />
                    Create Event
                </motion.button>
            </div>

            {showCreate && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="card"
                    style={{ marginBottom: 24 }}
                    onSubmit={handleCreateEvent}
                >
                    <h3 style={{ marginBottom: 16 }}>Create New Event</h3>
                    <div style={{ marginBottom: 16 }}>
                        <input
                            type="text"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                            className="input"
                            placeholder="Event title"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <textarea
                            value={newEvent.description}
                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                            className="input textarea"
                            placeholder="Description"
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                        <input
                            type="datetime-local"
                            value={newEvent.eventDate}
                            onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                            className="input"
                            required
                        />
                        <input
                            type="text"
                            value={newEvent.location}
                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                            className="input"
                            placeholder="Location"
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Event
                        </button>
                    </div>
                </motion.form>
            )}

            {events.length === 0 ? (
                <div className="empty-state">
                    <FiCalendar size={48} />
                    <p>No upcoming events. Create one!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {events.map(event => (
                        <Link key={event.id} to={`/events/${event.id}`}>
                            <motion.div
                                whileHover={{ y: -2 }}
                                className="card card-hover"
                            >
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <div style={{
                                        width: 60,
                                        height: 60,
                                        background: 'var(--gradient-primary)',
                                        borderRadius: 12,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        flexShrink: 0
                                    }}>
                                        <span style={{ fontSize: 20, fontWeight: 700 }}>
                                            {new Date(event.event_date).getDate()}
                                        </span>
                                        <span style={{ fontSize: 11, textTransform: 'uppercase' }}>
                                            {new Date(event.event_date).toLocaleString('en-US', { month: 'short' })}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3>{event.title}</h3>
                                        <div style={{ display: 'flex', gap: 16, color: 'var(--color-muted)', fontSize: 13, marginTop: 4 }}>
                                            <span>
                                                <FiCalendar style={{ marginRight: 4 }} />
                                                {formatDate(event.event_date)}
                                            </span>
                                            {event.location && (
                                                <span>
                                                    <FiMapPin style={{ marginRight: 4 }} />
                                                    {event.location}
                                                </span>
                                            )}
                                            <span>
                                                <FiUsers style={{ marginRight: 4 }} />
                                                {event.rsvp_count || 0} RSVPs
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
