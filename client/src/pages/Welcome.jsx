import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBook, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Welcome = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const features = [
        { icon: FiBook, title: 'Learn', desc: 'Curated roadmaps' },
        { icon: FiUsers, title: 'Connect', desc: 'Build your network' },
        { icon: FiTrendingUp, title: 'Grow', desc: 'Track progress' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-void)',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-on-dark)'
        }}>
            {/* Architectural Grid Background */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
            }} />

            {/* Glowing Orbs */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '800px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(166, 139, 91, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-30%',
                left: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)'
            }} />

            {/* Content */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40,
                position: 'relative',
                zIndex: 1
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ textAlign: 'center', maxWidth: 640 }}
                >
                    {/* Brand Mark */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{
                            width: 64,
                            height: 64,
                            background: 'var(--color-gold-buff)',
                            borderRadius: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 40px',
                            boxShadow: '0 0 40px rgba(166, 139, 91, 0.4)'
                        }}
                    >
                        <span style={{
                            color: 'var(--color-void)',
                            fontFamily: 'var(--font-serif)',
                            fontSize: 32,
                            fontWeight: 700
                        }}>U</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="t-headline-1"
                        style={{
                            fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                            color: '#FFF',
                            marginBottom: 24,
                            letterSpacing: '-0.02em'
                        }}
                    >
                        UniteX
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        style={{
                            fontSize: '1.25rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: 56,
                            lineHeight: 1.6,
                            maxWidth: 500,
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                    >
                        The network for ambitious builders. <br />
                        Master your craft, connect with peers, and accelerate your growth.
                    </motion.p>

                    {/* Feature Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 48,
                            marginBottom: 64
                        }}
                    >
                        {features.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                style={{ textAlign: 'center' }}
                            >
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                    <f.icon size={20} color="var(--color-gold-buff)" />
                                </div>
                                <div style={{ color: '#FFF', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                                    {f.title}
                                </div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: 12 }}>
                                    {f.desc}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        style={{ display: 'flex', gap: 16, justifyContent: 'center' }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/signup')}
                            className="btn"
                            style={{
                                padding: '16px 40px',
                                background: 'var(--color-gold-buff)',
                                color: 'var(--color-void)',
                                borderRadius: 'var(--radius-pill)',
                                fontSize: 16,
                                fontWeight: 600,
                                height: 'auto'
                            }}
                        >
                            Get Started
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/login')}
                            className="btn"
                            style={{
                                padding: '16px 40px',
                                background: 'transparent',
                                color: '#FFF',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 'var(--radius-pill)',
                                fontSize: 16,
                                fontWeight: 600,
                                height: 'auto'
                            }}
                        >
                            Sign In
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Welcome;
