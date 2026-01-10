import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiGift, FiUser, FiBell, FiEye, FiSettings, FiShield } from 'react-icons/fi';

const Settings = () => {
    const { user, getAuthHeader, updateUser } = useAuth();
    const [settings, setSettings] = useState(null);
    const [referralCode, setReferralCode] = useState('');
    const [referrals, setReferrals] = useState([]);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [settingsRes, codeRes, referralsRes] = await Promise.all([
                fetch('/api/users/settings/me', { headers: getAuthHeader() }),
                fetch('/api/referrals/my-code', { headers: getAuthHeader() }),
                fetch('/api/referrals/my-referrals', { headers: getAuthHeader() })
            ]);

            setSettings(await settingsRes.json());
            const codeData = await codeRes.json();
            setReferralCode(codeData.referralCode);
            setReferrals(await referralsRes.json());
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const updateSettings = async (updates) => {
        try {
            await fetch('/api/users/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(updates)
            });
            setSettings({ ...settings, ...updates });
        } catch (error) {
            console.error('Failed to update settings:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: 64, textAlign: 'center' }}>
                <div className="spinner" />
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile & Privacy', icon: FiUser },
        { id: 'referral', label: 'Referrals', icon: FiGift },
        { id: 'notifications', label: 'Notifications', icon: FiBell }
    ];

    return (
        <div className="layout-content">
            <header style={{ marginBottom: 48 }}>
                <h1 className="t-headline-1">Settings</h1>
                <p className="t-subhead">Configure your architect profile.</p>
            </header>

            {/* Tab Navigation */}
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
                    </button>
                ))}
            </div>

            <div className="grid-12">
                <div style={{ gridColumn: 'span 8' }}>
                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    background: 'var(--color-marble)',
                                    borderRadius: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <FiShield size={24} color="var(--color-void)" />
                                </div>
                                <h3 className="t-headline-2" style={{ fontSize: '1.5rem', margin: 0 }}>Privacy</h3>
                            </div>

                            <div style={{ marginBottom: 32 }}>
                                <label className="input-label" style={{ marginBottom: 12, display: 'block' }}>
                                    PROFILE VISIBILITY
                                </label>
                                <div style={{ position: 'relative', maxWidth: 300 }}>
                                    <select
                                        value={settings?.profile_visibility || 'public'}
                                        onChange={(e) => updateSettings({ profileVisibility: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="public">Public (Recommended)</option>
                                        <option value="connections">Connections Only</option>
                                        <option value="private">Private</option>
                                    </select>
                                    <FiEye style={{ position: 'absolute', right: 16, top: 16, pointerEvents: 'none', color: 'var(--text-tertiary)' }} />
                                </div>
                                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 8 }}>
                                    Control who looks at your blueprints.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Referral */}
                    {activeTab === 'referral' && (
                        <div>
                            <div className="card" style={{
                                marginBottom: 24,
                                background: 'linear-gradient(135deg, var(--color-obsidian) 0%, #2a2a2a 100%)',
                                color: '#FFF'
                            }}>
                                <h3 className="t-headline-2" style={{ color: 'var(--color-gold-buff)', fontSize: '1.5rem', marginBottom: 16 }}>Legacy Code</h3>
                                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32, maxWidth: '80%' }}>
                                    Grant access to fellow architects. You earn <strong>+100 XP</strong> for every successful recruit.
                                </p>

                                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        padding: '16px 32px',
                                        borderRadius: 16,
                                        fontFamily: 'monospace',
                                        fontSize: 24,
                                        fontWeight: 700,
                                        letterSpacing: 4,
                                        color: '#FFF'
                                    }}>
                                        {referralCode}
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={copyReferralCode}
                                        className="btn"
                                        style={{
                                            background: 'var(--color-gold-buff)',
                                            color: '#000',
                                            height: 56,
                                            padding: '0 24px'
                                        }}
                                    >
                                        {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
                                        <span style={{ marginLeft: 8, fontWeight: 600 }}>{copied ? 'COPIED' : 'COPY CODE'}</span>
                                    </motion.button>
                                </div>
                            </div>

                            <div className="card">
                                <h3 className="t-headline-2" style={{ fontSize: '1.25rem', marginBottom: 24 }}>Your Recruits ({referrals.length})</h3>
                                {referrals.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-tertiary)' }}>
                                        <FiGift size={32} style={{ marginBottom: 16, opacity: 0.5 }} />
                                        <p>No referrals yet. Share your code to start building your network.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                        {referrals.map(ref => (
                                            <div key={ref.id} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: 16,
                                                background: 'var(--bg-app)',
                                                borderRadius: 12
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                    <div className="avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                                                        {ref.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <strong>{ref.name}</strong>
                                                        <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>@{ref.user_id}</p>
                                                    </div>
                                                </div>
                                                <span className="badge badge-gold">
                                                    +100 XP
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="card">
                            <h3 className="t-headline-2" style={{ fontSize: '1.5rem', marginBottom: 24 }}>Signals</h3>

                            <div>
                                <label className="input-label" style={{ marginBottom: 12, display: 'block' }}>
                                    INTENSITY
                                </label>
                                <select
                                    value={settings?.notification_intensity || 'balanced'}
                                    onChange={(e) => updateSettings({ notificationIntensity: e.target.value })}
                                    className="input-field"
                                    style={{ maxWidth: 300 }}
                                >
                                    <option value="all">Everything (High Noise)</option>
                                    <option value="balanced">Balanced (Recommended)</option>
                                    <option value="minimal">Focus Mode (Minimal)</option>
                                    <option value="none">Silence (None)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
