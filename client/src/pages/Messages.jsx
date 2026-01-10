import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMessageSquare, FiUser, FiInfo } from 'react-icons/fi';

const Messages = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, getAuthHeader } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeConversation, setActiveConversation] = useState(id);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (activeConversation) {
            fetchMessages(activeConversation);
        }
    }, [activeConversation]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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

            // Update conversation list last message preview
            const updatedConvs = conversations.map(c => {
                if (c.id == activeConversation) {
                    return { ...c, lastMessage: { content: newMessage } };
                }
                return c;
            });
            setConversations(updatedConvs);

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
            <div style={{ padding: 64, textAlign: 'center' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="layout-content" style={{ maxHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <h1 className="t-headline-1" style={{ marginBottom: 24 }}>Messages</h1>

            <div className="card" style={{
                flex: 1,
                display: 'flex',
                gap: 0,
                padding: 0,
                overflow: 'hidden',
                minHeight: 600
            }}>
                {/* Conversation List */}
                <div style={{
                    width: 320,
                    borderRight: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--bg-app)'
                }}>
                    <div style={{ padding: 24, paddingBottom: 16 }}>
                        <h3 className="t-label">Inbox</h3>
                    </div>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {conversations.length === 0 ? (
                            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                <FiMessageSquare size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
                                <p style={{ fontSize: 13 }}>No active discussions</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {conversations.map(conv => {
                                    const other = getOtherParticipant(conv);
                                    const isActive = activeConversation == conv.id;
                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => selectConversation(conv.id)}
                                            style={{
                                                padding: '16px 24px',
                                                cursor: 'pointer',
                                                background: isActive ? 'var(--color-marble)' : 'transparent',
                                                border: 'none',
                                                borderBottom: '1px solid var(--border-subtle)',
                                                textAlign: 'left',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 16,
                                                transition: 'background 0.2s ease',
                                                width: '100%'
                                            }}
                                        >
                                            <div className="avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                                                {other?.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>
                                                    {other?.name || 'Unknown'}
                                                </div>
                                                {conv.lastMessage && (
                                                    <p style={{
                                                        fontSize: 13,
                                                        color: 'var(--text-tertiary)',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        margin: 0
                                                    }}>
                                                        {conv.lastMessage.content}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* active Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FFF' }}>
                    {activeConversation ? (
                        <>
                            {/* Chat Header */}
                            <div style={{
                                padding: '16px 24px',
                                borderBottom: '1px solid var(--border-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div className="avatar" style={{ width: 32, height: 32, fontSize: 14 }}>
                                        {conversations.find(c => c.id == activeConversation) && getOtherParticipant(conversations.find(c => c.id == activeConversation))?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span style={{ fontWeight: 600 }}>
                                        {conversations.find(c => c.id == activeConversation) && getOtherParticipant(conversations.find(c => c.id == activeConversation))?.name}
                                    </span>
                                </div>
                                <button className="btn-icon" style={{ color: 'var(--text-tertiary)' }}><FiInfo /></button>
                            </div>

                            {/* Messages */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: 24,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 24,
                                background: 'var(--bg-app)'
                            }}>
                                {messages.map(msg => {
                                    const isMe = msg.sender_id === user.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            style={{
                                                display: 'flex',
                                                justifyContent: isMe ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            <div style={{
                                                maxWidth: '70%',
                                                padding: '12px 20px',
                                                borderRadius: 16,
                                                background: isMe ? 'var(--color-obsidian)' : '#FFF',
                                                color: isMe ? '#FFF' : 'var(--text-primary)',
                                                boxShadow: isMe ? 'none' : '0 2px 8px rgba(0,0,0,0.05)',
                                                border: isMe ? 'none' : '1px solid var(--border-subtle)',
                                                borderBottomRightRadius: isMe ? 4 : 16,
                                                borderBottomLeftRadius: isMe ? 16 : 4
                                            }}>
                                                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{msg.content}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div style={{ padding: 24, background: '#FFF', borderTop: '1px solid var(--border-subtle)' }}>
                                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 16, position: 'relative' }}>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="input-field"
                                        placeholder="Type a message..."
                                        style={{ flex: 1, paddingRight: 48 }}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={!newMessage.trim()}
                                        style={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            bottom: 8,
                                            padding: '0 16px',
                                            borderRadius: 8,
                                            height: 'auto'
                                        }}
                                    >
                                        <FiSend size={16} />
                                    </motion.button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                            <div style={{
                                width: 64,
                                height: 64,
                                background: 'var(--color-marble)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16
                            }}>
                                <FiMessageSquare size={24} color="var(--color-gold-buff)" />
                            </div>
                            <h3 className="t-headline-2" style={{ fontSize: '1.25rem', marginBottom: 8, color: 'var(--text-primary)' }}>Your Messages</h3>
                            <p>Select a conversation to start messaging.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
