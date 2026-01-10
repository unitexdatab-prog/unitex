import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiSend, FiMessageSquare } from 'react-icons/fi';

const Messages = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, getAuthHeader } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(id);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation);
        }
    }, [activeConversation]);

    const fetchConversations = async () => {
        try {
            const response = await fetch('/api/messages/conversations', { headers: getAuthHeader() });
            setConversations(await response.json());
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (convId) => {
        try {
            const response = await fetch(`/api/messages/conversations/${convId}`, { headers: getAuthHeader() });
            setMessages(await response.json());
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        try {
            const response = await fetch(`/api/messages/conversations/${activeConversation}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ content: newMessage })
            });
            const message = await response.json();
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const getOtherParticipant = (conv) => {
        return conv.participants?.find(p => p.id !== user.id);
    };

    const selectConversation = (convId) => {
        setActiveConversation(convId);
        navigate(`/messages/${convId}`);
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
            <h1 style={{ marginBottom: 24 }}>Messages</h1>

            <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 200px)' }}>
                {/* Conversation List */}
                <div style={{ width: 280, flexShrink: 0, overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <div className="empty-state">
                            <FiMessageSquare size={32} />
                            <p style={{ fontSize: 14 }}>No conversations yet</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {conversations.map(conv => {
                                const other = getOtherParticipant(conv);
                                return (
                                    <motion.div
                                        key={conv.id}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => selectConversation(conv.id)}
                                        className="card"
                                        style={{
                                            padding: 12,
                                            cursor: 'pointer',
                                            background: activeConversation == conv.id ? 'var(--color-silver)' : 'var(--color-white)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div className="avatar">
                                                {other?.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h4 style={{ fontSize: 14 }}>{other?.name || 'Unknown'}</h4>
                                                {conv.lastMessage && (
                                                    <p style={{
                                                        fontSize: 12,
                                                        color: 'var(--color-muted)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {conv.lastMessage.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Messages */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {activeConversation ? (
                        <>
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: 16,
                                background: 'var(--color-silver)',
                                borderRadius: 16,
                                marginBottom: 16
                            }}>
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                                            marginBottom: 12
                                        }}
                                    >
                                        <div style={{
                                            background: msg.sender_id === user.id ? 'var(--color-gold)' : 'var(--color-white)',
                                            color: msg.sender_id === user.id ? 'white' : 'inherit',
                                            padding: '10px 16px',
                                            borderRadius: 16,
                                            maxWidth: '70%'
                                        }}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 12 }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="input"
                                    placeholder="Type a message..."
                                    style={{ flex: 1 }}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!newMessage.trim()}
                                >
                                    <FiSend />
                                </motion.button>
                            </form>
                        </>
                    ) : (
                        <div className="empty-state" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div>
                                <FiMessageSquare size={48} />
                                <p>Select a conversation to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
