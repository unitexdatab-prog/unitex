import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'relative',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'minmax(400px, 40%) 1fr',
            background: 'var(--color-alabaster)'
        }}>
            {/* 
               LEFT PANEL: The "Architectural" Statement 
               Features high-end typography and brand presence.
            */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    background: 'var(--color-void)',
                    color: 'var(--color-alabaster)',
                    position: 'relative',
                    padding: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    zIndex: 2
                }}
            >
                {/* Brand Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16
                    }}
                >
                    <div style={{
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, var(--color-gold-buff), var(--color-bronze))',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 700,
                        fontSize: 20,
                        boxShadow: '0 8px 16px rgba(166, 139, 91, 0.3)'
                    }}>U</div>
                    <span style={{
                        fontFamily: 'var(--font-sans)',
                        fontWeight: 600,
                        letterSpacing: '0.05em'
                    }}>UNITEX</span>
                </motion.div>

                {/* Central Statement */}
                <div style={{ position: 'relative' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
                        className="t-headline-1"
                        style={{ color: '#FFF', marginBottom: 24, maxWidth: '80%' }}
                    >
                        Design your <br />
                        <span style={{ color: 'var(--color-gold-buff)', fontStyle: 'italic' }}>legacy</span>.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="t-subhead"
                        style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 300, lineHeight: 1.6 }}
                    >
                        Join the elite network of builders, thinkers, and creators shaping the future.
                    </motion.p>
                </div>

                {/* Footer Metadata */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    style={{
                        display: 'flex',
                        gap: 32,
                        fontSize: 12,
                        color: 'rgba(255,255,255,0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}
                >
                    <span>© 2024 Unitex</span>
                    <span>V 3.0.0</span>
                </motion.div>

                {/* Abstract Visual Elements */}
                <div style={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-20%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(166, 139, 91, 0.15) 0%, transparent 60%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    filter: 'blur(40px)'
                }} />
            </motion.div>

            {/* 
               RIGHT PANEL: The "Functional" Precision
               Features the interactive form with micro-interactions.
            */}
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-marble)'
            }}>
                {/* Dynamic Background Mesh */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                    opacity: 0.5
                }} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    style={{
                        width: '100%',
                        maxWidth: 480,
                        padding: 48,
                        zIndex: 10
                    }}
                >
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <div style={{ marginBottom: 16 }}>
                            <h2 className="t-headline-2" style={{ marginBottom: 8 }}>Welcome back</h2>
                            <p className="t-subhead">Please enter your details.</p>
                        </div>

                        {/* Email Input */}
                        <div style={{ position: 'relative' }}>
                            <label className="input-label" htmlFor="email">EMAIL</label>
                            <motion.div
                                animate={{
                                    boxShadow: focusedField === 'email'
                                        ? '0 0 0 4px rgba(166, 139, 91, 0.15)'
                                        : '0 0 0 0px transparent'
                                }}
                                style={{ borderRadius: 14 }}
                            >
                                <input
                                    id="email"
                                    type="email"
                                    className="input-field"
                                    placeholder="name@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </motion.div>
                        </div>

                        {/* Password Input */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <label className="input-label" htmlFor="password">PASSWORD</label>
                                <a href="#" style={{ fontSize: 12, color: 'var(--text-tertiary)', textDecoration: 'none' }}>Forgot?</a>
                            </div>
                            <motion.div
                                animate={{
                                    boxShadow: focusedField === 'password'
                                        ? '0 0 0 4px rgba(166, 139, 91, 0.15)'
                                        : '0 0 0 0px transparent'
                                }}
                                style={{ borderRadius: 14 }}
                            >
                                <input
                                    id="password"
                                    type="password"
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('password')}
                                    onBlur={() => setFocusedField(null)}
                                />
                            </motion.div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: 16 }}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </motion.button>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <span style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>Don't have an account? </span>
                            <Link
                                to="/signup"
                                style={{
                                    color: 'var(--text-primary)',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    borderBottom: '1px solid currentColor'
                                }}
                            >
                                Join now
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
