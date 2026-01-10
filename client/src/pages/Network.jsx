import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import { motion } from 'framer-motion';
import { FiUserPlus, FiUsers, FiUserCheck } from 'react-icons/fi';

const Network = () => {
    const { getAuthHeader } = useAuth();
    const [activeTab, setActiveTab] = useState('friends');
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [friendsRes, pendingRes, suggestionsRes] = await Promise.all([
                fetch('/api/friends', { headers: getAuthHeader() }),
                fetch('/api/friends/pending', { headers: getAuthHeader() }),
                fetch('/api/friends/suggestions', { headers: getAuthHeader() })
            ]);

            setFriends(await friendsRes.json());
            setPending(await pendingRes.json());
            setSuggestions(await suggestionsRes.json());
        } catch (error) {
            console.error('Failed to fetch network data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await fetch(`/api/friends/accept/${requestId}`, {
                method: 'PUT',
                headers: getAuthHeader()
            });
            fetchData();
        } catch (error) {
            console.error('Failed to accept request:', error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await fetch(`/api/friends/reject/${requestId}`, {
                method: 'PUT',
                headers: getAuthHeader()
            });
            setPending(pending.filter(p => p.request_id !== requestId));
        } catch (error) {
            console.error('Failed to reject request:', error);
        }
    };

    const handleConnect = async (userId) => {
        try {
            await fetch(`/api/friends/request/${userId}`, {
                method: 'POST',
                headers: getAuthHeader()
            });
            setSuggestions(suggestions.filter(s => s.id !== userId));
        } catch (error) {
            console.error('Failed to send request:', error);
        }
    };

    const tabs = [
        { id: 'friends', label: 'Connections', icon: FiUsers, count: friends.length },
        { id: 'pending', label: 'Requests', icon: FiUserCheck, count: pending.length },
        { id: 'suggestions', label: 'Explore', icon: FiUserPlus, count: suggestions.length }
    ];

    return (
        <div className="layout-content">
            <header style={{ marginBottom: 48 }}>
                <h1 className="t-headline-1">Network</h1>
                <p className="t-subhead">Manage your professional ecosystem.</p>
            </header>

            {/* Tab Navigation - Architect Style */}
            <div style={{
                display: 'flex',
                gap: 32,
                marginBottom: 48,
                borderBottom: '1px solid var(--border-subtle)'
            }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            padding: '0 0 16px 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            borderBottom: activeTab === tab.id ? '2px solid var(--color-gold-buff)' : '2px solid transparent',
                            color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
                            transition: 'all 0.3s ease',
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.25rem'
                        }}
                    >
                        <tab.icon size={20} />
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="badge" style={{
                                background: activeTab === tab.id ? 'var(--color-gold-buff)' : 'var(--border-prominent)',
                                color: activeTab === tab.id ? '#FFF' : 'var(--text-tertiary)'
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid-12">
                {activeTab === 'friends' && (
                    <div style={{ gridColumn: '1 / -1' }}>
                        {friends.length === 0 ? (
                            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                <FiUsers size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                                <p>No connections yet. Start by exploring.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                                {friends.map(friend => (
                                    <div key={friend.id} className="card" style={{ padding: 0 }}>
                                        <UserCard user={friend} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'pending' && (
                    <div style={{ gridColumn: 'span 8' }}>
                        {pending.length === 0 ? (
                            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                <p>No pending requests.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {pending.map(request => (
                                    <motion.div
                                        key={request.request_id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="card"
                                        style={{ display: 'flex', alignItems: 'center', gap: 24, padding: 24 }}
                                    >
                                        <div className="avatar-ring" style={{ width: 56, height: 56 }}>
                                            {request.avatar_url ? (
                                                <img src={request.avatar_url} alt={request.name} className="avatar" />
                                            ) : (
                                                <div className="avatar" style={{ background: 'var(--color-obsidian)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                                    {request.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1.25rem', marginBottom: 4 }}>{request.name}</h4>
                                            <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>@{request.user_id}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button onClick={() => handleReject(request.request_id)} className="btn btn-ghost">Decline</button>
                                            <button onClick={() => handleAccept(request.request_id)} className="btn btn-primary">Accept</button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'suggestions' && (
                    <div style={{ gridColumn: '1 / -1' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                            {suggestions.map(user => (
                                <motion.div key={user.id} layout className="card" style={{ padding: 0 }}>
                                    <UserCard
                                        user={user}
                                        action={() => handleConnect(user.id)}
                                        actionLabel="Connect"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Network;
