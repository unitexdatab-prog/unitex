import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiArrowLeft, FiUser, FiMail, FiLock, FiCode } from 'react-icons/fi';

const Signup = () => {
    const navigate = useNavigate();
    const { signup, sendOTP, verifyOTP, isAuthenticated } = useAuth();

    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Profile
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await sendOTP(email);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await verifyOTP(email, otp);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup(email, password, name, referralCode);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-void)' }}>
            {/* Left Panel - Brand */}
            <div style={{
                flex: 1,
                background: 'var(--color-void)',
                position: 'relative',
                display: 'none',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '80px',
                borderRight: '1px solid rgba(255,255,255,0.05)',
                '@media (minWidth: 1024px)': { display: 'flex' } // Note: Inline media queries don't work, standard css handling assumed or hidden on mobile effectively via flex
            }} className="desktop-only-flex">
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.5
                }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: 480 }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        background: 'var(--color-gold-buff)',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40
                    }}>
                        <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-void)', fontFamily: 'var(--font-serif)' }}>U</span>
                    </div>
                    <h1 className="t-headline-1" style={{ color: '#FFF', fontSize: '3.5rem', marginBottom: 24, lineHeight: 1.1 }}>
                        Join the<br />Avant-Garde.
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
                        UniteX is where the next generation of builders architecture their future.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-app)',
                padding: 24
            }}>
                <div style={{ width: '100%', maxWidth: 420 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                height: 4,
                                flex: 1,
                                borderRadius: 2,
                                background: step >= i ? 'var(--color-gold-buff)' : 'var(--border-subtle)',
                                transition: 'background 0.3s ease'
                            }} />
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSendOTP}
                            >
                                <h2 className="t-headline-2" style={{ fontSize: '2rem', marginBottom: 8 }}>Get Started</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Enter your email to verify your identity.</p>

                                <div style={{ marginBottom: 24 }}>
                                    <label className="input-label">EMAIL ADDRESS</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-field"
                                            placeholder="architect@example.com"
                                            required
                                            style={{ paddingLeft: 48 }}
                                        />
                                        <FiMail style={{ position: 'absolute', left: 16, top: 20, color: 'var(--text-tertiary)' }} />
                                    </div>
                                </div>

                                {error && <div style={{ color: 'var(--color-error)', fontSize: 13, marginBottom: 16 }}>{error}</div>}

                                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                                    {loading ? 'Sending...' : 'Continue'} <FiArrowRight />
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyOTP}
                            >
                                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <FiArrowLeft /> Back
                                </button>
                                <h2 className="t-headline-2" style={{ fontSize: '2rem', marginBottom: 8 }}>Verify Email</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Enter the code sent to {email}</p>

                                <div style={{ marginBottom: 24 }}>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="input-field"
                                        placeholder="000 000"
                                        style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '0.2em', padding: '16px' }}
                                        required
                                        autoFocus
                                    />
                                </div>

                                {error && <div style={{ color: 'var(--color-error)', fontSize: 13, marginBottom: 16 }}>{error}</div>}

                                <button type="submit" disabled={loading || otp.length !== 6} className="btn btn-primary" style={{ width: '100%' }}>
                                    {loading ? 'Verifying...' : 'Verify Code'}
                                </button>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSignup}
                            >
                                <h2 className="t-headline-2" style={{ fontSize: '2rem', marginBottom: 8 }}>Finalize</h2>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>Complete your profile.</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    <div>
                                        <label className="input-label">FULL NAME</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="input-field"
                                                placeholder="John Roark"
                                                required
                                                style={{ paddingLeft: 48 }}
                                            />
                                            <FiUser style={{ position: 'absolute', left: 16, top: 20, color: 'var(--text-tertiary)' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">PASSWORD</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="input-field"
                                                placeholder="••••••••"
                                                required
                                                minLength={6}
                                                style={{ paddingLeft: 48 }}
                                            />
                                            <FiLock style={{ position: 'absolute', left: 16, top: 20, color: 'var(--text-tertiary)' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">REFERRAL CODE (OPTIONAL)</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                value={referralCode}
                                                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                                className="input-field"
                                                placeholder="CODE123"
                                                style={{ paddingLeft: 48, letterSpacing: '2px' }}
                                            />
                                            <FiCode style={{ position: 'absolute', left: 16, top: 20, color: 'var(--text-tertiary)' }} />
                                        </div>
                                    </div>
                                </div>

                                {error && <div style={{ color: 'var(--color-error)', fontSize: 13, marginTop: 16 }}>{error}</div>}

                                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 32 }}>
                                    {loading ? 'Creating Account...' : 'Initialize'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div style={{ marginTop: 32, textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Sign In</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
