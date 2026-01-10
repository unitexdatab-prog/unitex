import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--cream)'
        }}>
            {/* Left Side - Brand */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    background: 'var(--ink)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '60px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Abstract Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.03,
                    background: `
                        radial-gradient(circle at 20% 80%, var(--gold) 0%, transparent 40%),
                        radial-gradient(circle at 80% 20%, var(--bronze) 0%, transparent 40%)
                    `
                }} />

                {/* Grid lines */}
                <div style={{
                    position: 'absolute',
                    inset: 40,
                    border: '1px solid rgba(166, 139, 91, 0.1)',
                    borderRadius: 32
                }} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
                >
                    {/* Logo Mark */}
                    <div style={{
                        width: 72,
                        height: 72,
                        background: 'linear-gradient(135deg, var(--gold) 0%, var(--bronze) 100%)',
                        borderRadius: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 40px',
                        boxShadow: '0 8px 32px rgba(166, 139, 91, 0.3)'
                    }}>
                        <span style={{
                            color: 'var(--ivory)',
                            fontFamily: 'var(--font-display)',
                            fontSize: 36,
                            fontWeight: 600
                        }}>U</span>
                    </div>

                    <h1 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        fontWeight: 500,
                        color: 'var(--ivory)',
                        marginBottom: 16,
                        lineHeight: 1.1
                    }}>
                        UniteX
                    </h1>

                    <p style={{
                        color: 'var(--mist)',
                        fontSize: 16,
                        maxWidth: 280,
                        lineHeight: 1.7
                    }}>
                        Where ambitious minds connect, learn, and build together.
                    </p>

                    {/* Decorative element */}
                    <div style={{
                        marginTop: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16
                    }}>
                        <div style={{ width: 24, height: 1, background: 'var(--bronze)' }} />
                        <span style={{ color: 'var(--gold)', fontSize: 12, letterSpacing: 3 }}>✦</span>
                        <div style={{ width: 24, height: 1, background: 'var(--bronze)' }} />
                    </div>
                </motion.div>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 60
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        width: '100%',
                        maxWidth: 420
                    }}
                >
                    <span style={{
                        display: 'block',
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 2,
                        color: 'var(--bronze)',
                        marginBottom: 12
                    }}>
                        Welcome back
                    </span>

                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                        fontWeight: 500,
                        marginBottom: 8,
                        lineHeight: 1.2
                    }}>
                        Sign in to your account
                    </h2>

                    <p style={{
                        color: 'var(--mist)',
                        marginBottom: 40
                    }}>
                        Continue your learning journey
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{
                                display: 'block',
                                fontSize: 11,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: 1.5,
                                color: 'var(--bronze)',
                                marginBottom: 10
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '18px 20px',
                                    background: 'var(--ivory)',
                                    border: '2px solid transparent',
                                    borderRadius: 16,
                                    fontSize: 16,
                                    color: 'var(--ink)',
                                    transition: 'all 200ms ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--gold)';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(166, 139, 91, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'transparent';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <label style={{
                                display: 'block',
                                fontSize: 11,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: 1.5,
                                color: 'var(--bronze)',
                                marginBottom: 10
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '18px 20px',
                                    background: 'var(--ivory)',
                                    border: '2px solid transparent',
                                    borderRadius: 16,
                                    fontSize: 16,
                                    color: 'var(--ink)',
                                    transition: 'all 200ms ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--gold)';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(166, 139, 91, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'transparent';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    color: '#C53030',
                                    fontSize: 14,
                                    marginBottom: 24,
                                    padding: '12px 16px',
                                    background: 'rgba(197, 48, 48, 0.08)',
                                    borderRadius: 12,
                                    border: '1px solid rgba(197, 48, 48, 0.2)'
                                }}
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '18px 32px',
                                background: 'var(--ink)',
                                color: 'var(--ivory)',
                                border: 'none',
                                borderRadius: 100,
                                fontSize: 15,
                                fontWeight: 600,
                                letterSpacing: 0.5,
                                cursor: 'pointer',
                                boxShadow: '0 4px 20px rgba(26, 24, 21, 0.2)',
                                transition: 'all 200ms ease',
                                opacity: loading ? 0.7 : 1,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <span style={{ position: 'relative', zIndex: 1 }}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </span>
                        </motion.button>
                    </form>

                    <div style={{
                        marginTop: 32,
                        paddingTop: 32,
                        borderTop: '1px solid var(--sand)',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: 'var(--mist)', fontSize: 14 }}>
                            New to UniteX?{' '}
                            <Link
                                to="/signup"
                                style={{
                                    color: 'var(--gold)',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    borderBottom: '1px solid transparent',
                                    transition: 'border-color 200ms'
                                }}
                                onMouseOver={(e) => e.target.style.borderBottomColor = 'var(--gold)'}
                                onMouseOut={(e) => e.target.style.borderBottomColor = 'transparent'}
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
