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
            // Refresh data
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
        { id: 'suggestions', label: 'Suggestions', icon: FiUserPlus, count: suggestions.length }
    ];

    if (loading) {
        return (
            <div className="flex justify-center p-6">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h1 style={{ marginBottom: 24 }}>Network</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                        {tab.count > 0 && (
                            <span style={{
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--color-medium-gray)',
                                padding: '2px 8px',
                                borderRadius: 999,
                                fontSize: 12
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {activeTab === 'friends' && (
                <div>
                    {friends.length === 0 ? (
                        <div className="empty-state">
                            <FiUsers size={48} />
                            <p>No connections yet. Start by sending requests!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {friends.map(friend => (
                                <UserCard key={friend.id} user={friend} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'pending' && (
                <div>
                    {pending.length === 0 ? (
                        <div className="empty-state">
                            <FiUserCheck size={48} />
                            <p>No pending requests</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {pending.map(request => (
                                <motion.div
                                    key={request.request_id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="card"
                                    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}
                                >
                                    <div className="avatar avatar-lg">
                                        {request.avatar_url ? (
                                            <img src={request.avatar_url} alt={request.name} />
                                        ) : (
                                            request.name?.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4>{request.name}</h4>
                                        <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                                            @{request.user_id}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => handleReject(request.request_id)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => handleAccept(request.request_id)}
                                            className="btn btn-primary btn-sm"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'suggestions' && (
                <div>
                    {suggestions.length === 0 ? (
                        <div className="empty-state">
                            <FiUserPlus size={48} />
                            <p>No suggestions at the moment</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {suggestions.map(user => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    action={() => handleConnect(user.id)}
                                    actionLabel="Connect"
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Network;
