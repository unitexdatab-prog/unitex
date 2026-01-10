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
            background: 'var(--ink)',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Abstract Background Elements */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '60%',
                height: '80%',
                background: 'radial-gradient(circle, rgba(166, 139, 91, 0.1) 0%, transparent 70%)',
                borderRadius: '50%'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-30%',
                left: '-10%',
                width: '50%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(139, 115, 85, 0.08) 0%, transparent 70%)',
                borderRadius: '50%'
            }} />

            {/* Grid Pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(166, 139, 91, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(166, 139, 91, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px'
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
                    style={{ textAlign: 'center', maxWidth: 600 }}
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        style={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(135deg, var(--gold) 0%, var(--bronze) 100%)',
                            borderRadius: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 40px',
                            boxShadow: '0 16px 40px rgba(166, 139, 91, 0.3)'
                        }}
                    >
                        <span style={{
                            color: 'var(--ivory)',
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 44,
                            fontWeight: 600
                        }}>U</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 'clamp(3rem, 8vw, 5rem)',
                            fontWeight: 500,
                            color: 'var(--ivory)',
                            marginBottom: 24,
                            lineHeight: 1
                        }}
                    >
                        UniteX
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        style={{
                            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                            color: 'var(--mist)',
                            marginBottom: 48,
                            lineHeight: 1.7
                        }}
                    >
                        A minimalist social learning platform for ambitious minds.
                        <br />
                        Learn, connect, and build together.
                    </motion.p>

                    {/* Features */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 32,
                            marginBottom: 56
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
                                    background: 'rgba(166, 139, 91, 0.15)',
                                    borderRadius: 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 12px',
                                    color: 'var(--gold)'
                                }}>
                                    <f.icon size={22} />
                                </div>
                                <div style={{ color: 'var(--ivory)', fontWeight: 600, fontSize: 14 }}>
                                    {f.title}
                                </div>
                                <div style={{ color: 'var(--mist)', fontSize: 12 }}>
                                    {f.desc}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        style={{ display: 'flex', gap: 16, justifyContent: 'center' }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/signup')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '18px 36px',
                                background: 'linear-gradient(135deg, var(--gold) 0%, var(--bronze) 100%)',
                                color: 'var(--ivory)',
                                border: 'none',
                                borderRadius: 100,
                                fontSize: 15,
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 8px 32px rgba(166, 139, 91, 0.3)'
                            }}
                        >
                            Get Started <FiArrowRight size={18} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '18px 36px',
                                background: 'transparent',
                                color: 'var(--ivory)',
                                border: '1.5px solid rgba(166, 139, 91, 0.3)',
                                borderRadius: 100,
                                fontSize: 15,
                                fontWeight: 600,
                                cursor: 'pointer'
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
