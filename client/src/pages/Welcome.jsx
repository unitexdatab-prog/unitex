import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Welcome = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-light-gray)',
            padding: 20
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', maxWidth: 500 }}
            >
                <div style={{
                    width: 80,
                    height: 80,
                    background: 'var(--gradient-primary)',
                    borderRadius: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px',
                    boxShadow: '0 12px 32px rgba(244, 81, 28, 0.3)'
                }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 36 }}>U</span>
                </div>

                <h1 style={{ fontSize: 36, marginBottom: 16 }}>Welcome to UniteX</h1>
                <p style={{ color: 'var(--color-muted)', fontSize: 18, marginBottom: 32 }}>
                    A minimalist social learning platform for students, explorers, and builders.
                </p>

                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/signup')}
                        className="btn btn-primary btn-lg"
                    >
                        Get Started
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login')}
                        className="btn btn-secondary btn-lg"
                    >
                        Sign In
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Welcome;
