import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiCheck, FiX, FiArrowLeft, FiMessageSquare } from 'react-icons/fi';

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
        return {
            date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    if (loading) return <div style={{ padding: 64, textAlign: 'center' }}><div className="spinner" /></div>;
    if (!event) return <div className="layout-content"><h2 className="t-headline-2">Event not found</h2></div>;

    const date = formatDate(event.event_date);

    return (
        <div className="layout-content">
            <Link to="/events" className="btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, paddingLeft: 0 }}>
                <FiArrowLeft /> Back to Timeline
            </Link>

            {/* Hero Card */}
            <div className="card" style={{
                padding: 0,
                overflow: 'hidden',
                marginBottom: 40,
                background: 'var(--color-obsidian)',
                color: '#FFF',
                border: 'none'
            }}>
                <div style={{ padding: 40, position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 300,
                        height: 300,
                        background: 'radial-gradient(circle, rgba(166,139,91,0.2) 0%, transparent 70%)',
                        borderRadius: '50%'
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                            <span className="badge badge-gold">Event</span>
                            {hasRsvp && <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF' }}>attending</span>}
                        </div>

                        <h1 className="t-headline-1" style={{ fontSize: '3rem', color: '#FFF', marginBottom: 24 }}>{event.title}</h1>

                        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', color: 'rgba(255,255,255,0.8)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ padding: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}><FiCalendar /></div>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{date.date}</div>
                                    <div style={{ fontSize: 13, opacity: 0.7 }}>{date.time}</div>
                                </div>
                            </div>
                            {event.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ padding: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}><FiMapPin /></div>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Location</div>
                                        <div style={{ fontSize: 13, opacity: 0.7 }}>{event.location}</div>
                                    </div>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ padding: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 8 }}><FiUsers /></div>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{event.rsvps?.length || 0} RSVPs</div>
                                    <div style={{ fontSize: 13, opacity: 0.7 }}>Join the session</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '24px 40px',
                    background: 'rgba(255,255,255,0.05)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
                        Hosted by <strong style={{ color: '#FFF' }}>UniteX Community</strong>
                    </div>
                    <div>
                        {hasRsvp ? (
                            <button onClick={handleCancelRsvp} className="btn-ghost" style={{ color: '#FFF' }}>
                                Cancel RSVP
                            </button>
                        ) : (
                            <motion.button whileHover={{ scale: 1.05 }} onClick={handleRsvp} className="btn" style={{ background: 'var(--color-gold-buff)', color: 'var(--color-void)' }}>
                                Confirm Attendance
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid-12">
                <div style={{ gridColumn: 'span 8' }}>
                    <div style={{ marginBottom: 48 }}>
                        <h3 className="t-headline-2" style={{ marginBottom: 24 }}>About this Event</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                            {event.description || 'No description provided.'}
                        </p>
                    </div>

                    <div style={{ marginBottom: 48 }}>
                        <h3 className="t-headline-2" style={{ marginBottom: 24 }}>Reflections</h3>
                        {hasRsvp && (
                            <div className="card" style={{ marginBottom: 32, background: 'var(--bg-app)' }}>
                                <form onSubmit={handleAddReflection}>
                                    <h4 className="t-label" style={{ marginBottom: 12 }}>Share your takeaways</h4>
                                    <textarea
                                        value={reflection}
                                        onChange={(e) => setReflection(e.target.value)}
                                        className="input-field"
                                        placeholder="What did you learn?"
                                        style={{ minHeight: 100, marginBottom: 16 }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="badge badge-gold">+20 XP</span>
                                        <button type="submit" className="btn btn-primary">Post Reflection</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {event.reflections?.length > 0 ? (
                                event.reflections.map(ref => (
                                    <div key={ref.id} className="card" style={{ padding: 24 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                            <div className="avatar">{ref.avatar_url ? <img src={ref.avatar_url} /> : ref.author_name?.charAt(0).toUpperCase()}</div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{ref.author_name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Reflected on {new Date(ref.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <p style={{ lineHeight: 1.5 }}>{ref.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-tertiary)', border: '1px dashed var(--border-subtle)', borderRadius: 16 }}>
                                    <FiMessageSquare style={{ opacity: 0.5, marginBottom: 8 }} size={24} />
                                    <p>No reflections yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ gridColumn: 'span 4' }}>
                    <div className="card">
                        <h3 className="t-headline-2" style={{ fontSize: '1.25rem', marginBottom: 24 }}>Attendees</h3>
                        {event.rsvps?.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                                {event.rsvps.map(user => (
                                    <Link key={user.id} to={`/profile/${user.id}`} title={user.name}>
                                        <motion.div whileHover={{ scale: 1.1 }} className="avatar">
                                            {user.avatar_url ? <img src={user.avatar_url} /> : user.name?.charAt(0).toUpperCase()}
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'var(--text-tertiary)' }}>Be the first to join.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
