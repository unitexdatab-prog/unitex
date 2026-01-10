import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiCheck, FiX } from 'react-icons/fi';

const EventDetail = () => {
    const { id } = useParams();
    const { getAuthHeader } = useAuth();
    const [event, setEvent] = useState(null);
    const [hasRsvp, setHasRsvp] = useState(false);
    const [reflection, setReflection] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        try {
            const [eventRes, rsvpRes] = await Promise.all([
                fetch(`/api/events/${id}`),
                fetch(`/api/events/${id}/rsvp-status`, { headers: getAuthHeader() })
            ]);
            setEvent(await eventRes.json());
            const rsvpData = await rsvpRes.json();
            setHasRsvp(rsvpData.hasRsvp);
        } catch (error) {
            console.error('Failed to fetch event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRsvp = async () => {
        try {
            await fetch(`/api/events/${id}/rsvp`, {
                method: 'POST',
                headers: getAuthHeader()
            });
            setHasRsvp(true);
            fetchEvent();
        } catch (error) {
            console.error('Failed to RSVP:', error);
        }
    };

    const handleCancelRsvp = async () => {
        try {
            await fetch(`/api/events/${id}/rsvp`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            setHasRsvp(false);
            fetchEvent();
        } catch (error) {
            console.error('Failed to cancel RSVP:', error);
        }
    };

    const handleAddReflection = async (e) => {
        e.preventDefault();
        if (!reflection.trim()) return;

        try {
            await fetch(`/api/events/${id}/reflect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ content: reflection })
            });
            setReflection('');
            fetchEvent();
        } catch (error) {
            console.error('Failed to add reflection:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
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

    if (!event) {
        return <div className="empty-state">Event not found</div>;
    }

    return (
        <div className="animate-fadeIn">
            <Link to="/events" style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 16, display: 'block' }}>
                ← Back to Events
            </Link>

            <div className="card" style={{ marginBottom: 24 }}>
                <h1 style={{ marginBottom: 16 }}>{event.title}</h1>

                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 20, color: 'var(--color-muted)' }}>
                    <span>
                        <FiCalendar style={{ marginRight: 8 }} />
                        {formatDate(event.event_date)}
                    </span>
                    {event.location && (
                        <span>
                            <FiMapPin style={{ marginRight: 8 }} />
                            {event.location}
                        </span>
                    )}
                    <span>
                        <FiUsers style={{ marginRight: 8 }} />
                        {event.rsvps?.length || 0} attending
                    </span>
                </div>

                {event.description && (
                    <p style={{ marginBottom: 20 }}>{event.description}</p>
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                    {hasRsvp ? (
                        <>
                            <span className="tag tag-primary">
                                <FiCheck /> You're attending
                            </span>
                            <button onClick={handleCancelRsvp} className="btn btn-secondary btn-sm">
                                <FiX /> Cancel RSVP
                            </button>
                        </>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={handleRsvp}
                            className="btn btn-primary"
                        >
                            RSVP
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Attendees */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>Attendees ({event.rsvps?.length || 0})</h3>
                {event.rsvps?.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                        {event.rsvps.map(user => (
                            <Link key={user.id} to={`/profile/${user.id}`}>
                                <div className="avatar" title={user.name}>
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.name} />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">No one has RSVPd yet. Be the first!</p>
                )}
            </div>

            {/* Reflections */}
            <div className="card">
                <h3 style={{ marginBottom: 16 }}>Reflections</h3>

                {hasRsvp && (
                    <form onSubmit={handleAddReflection} style={{ marginBottom: 20 }}>
                        <textarea
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            className="input textarea"
                            placeholder="Share your reflection on this event..."
                            style={{ marginBottom: 12 }}
                        />
                        <button type="submit" className="btn btn-primary btn-sm">
                            Add Reflection (+20 XP)
                        </button>
                    </form>
                )}

                {event.reflections?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {event.reflections.map(ref => (
                            <div key={ref.id} style={{ padding: 16, background: 'var(--color-silver)', borderRadius: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                                    <div className="avatar avatar-sm">
                                        {ref.avatar_url ? (
                                            <img src={ref.avatar_url} alt={ref.author_name} />
                                        ) : (
                                            ref.author_name?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <span style={{ fontWeight: 600 }}>{ref.author_name}</span>
                                </div>
                                <p>{ref.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted">No reflections yet.</p>
                )}
            </div>
        </div>
    );
};

export default EventDetail;
