import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiPlus, FiClock } from 'react-icons/fi';

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
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        };
    };

    return (
        <div className="layout-content">
            <header style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="t-headline-1">Events</h1>
                    <p className="t-subhead">Synchronize with the community.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreate(!showCreate)}
                    className="btn btn-primary"
                >
                    <FiPlus size={20} /> Host Event
                </motion.button>
            </header>

            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="card" style={{ maxWidth: 600 }}>
                            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <h3 className="t-headline-2" style={{ fontSize: '1.5rem' }}>Schedule an Gathering</h3>
                                <div>
                                    <label className="input-label">TITLE</label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g. Design System Workshop"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="input-label">DESCRIPTION</label>
                                    <textarea
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        className="input-field"
                                        placeholder="What will happen?"
                                        style={{ minHeight: 100 }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                                    <div>
                                        <label className="input-label">DATE & TIME</label>
                                        <input
                                            type="datetime-local"
                                            value={newEvent.eventDate}
                                            onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">LOCATION</label>
                                        <input
                                            type="text"
                                            value={newEvent.location}
                                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                            className="input-field"
                                            placeholder="Zoom / Conference Room A"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 16 }}>
                                    <button type="button" onClick={() => setShowCreate(false)} className="btn btn-ghost">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Publish Event
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div style={{ padding: 64, textAlign: 'center' }}>
                    <div className="spinner" />
                </div>
            ) : (
                <div className="grid-12">
                    <div style={{ gridColumn: 'span 8' }}>
                        {events.length === 0 ? (
                            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                <FiCalendar size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                                <p>The timeline is empty. Be the first to schedule something.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {events.map((event, i) => {
                                    const date = formatDate(event.event_date);
                                    return (
                                        <Link key={event.id} to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="card card-hover"
                                                style={{ padding: 0, overflow: 'hidden', display: 'flex' }}
                                            >
                                                {/* Date Sidebar */}
                                                <div style={{
                                                    width: 100,
                                                    background: 'var(--color-marble)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: 24,
                                                    borderRight: '1px solid var(--border-subtle)'
                                                }}>
                                                    <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-obsidian)', lineHeight: 1 }}>{date.day}</span>
                                                    <span style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--text-tertiary)', fontWeight: 600, marginTop: 4 }}>{date.month}</span>
                                                </div>

                                                {/* Content */}
                                                <div style={{ padding: 24, flex: 1 }}>
                                                    <h3 className="t-headline-2" style={{ fontSize: '1.25rem', marginBottom: 8 }}>{event.title}</h3>
                                                    <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'var(--text-secondary)' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <FiClock size={14} /> {date.time}
                                                        </span>
                                                        {event.location && (
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                <FiMapPin size={14} /> {event.location}
                                                            </span>
                                                        )}
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <FiUsers size={14} /> {event.rsvp_count || 0} Attending
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div style={{ gridColumn: 'span 4' }}>
                        <div className="card" style={{ background: 'var(--color-marble)', border: 'none' }}>
                            <h3 className="t-headline-2" style={{ fontSize: '1rem', marginBottom: 16 }}>Upcoming</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                                Events are a great way to earn XP and build your network. Hosts earn +50 XP per event.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
