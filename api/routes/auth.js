const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../services/email');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'unitex_jwt_secret_key_change_in_production';

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate unique user ID (UTXXXXX format)
const generateUserId = () => {
    return 'UT' + Math.floor(10000 + Math.random() * 90000);
};

// Generate referral code
const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Validate email domain
const isValidEmailDomain = (email) => {
    const allowedDomains = ['gmail.com', 'edu', 'edu.in'];
    const domain = email.split('@')[1];
    return allowedDomains.some(d => domain === d || domain.endsWith('.' + d));
};

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const pool = req.app.locals.pool;

    try {
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        if (!isValidEmailDomain(email)) {
            return res.status(400).json({ error: 'Please use Gmail or educational email' });
        }

        // Check if user already exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete old OTPs for this email
        await pool.query('DELETE FROM otp_codes WHERE email = $1', [email]);

        // Store new OTP
        await pool.query(
            'INSERT INTO otp_codes (email, code, expires_at) VALUES ($1, $2, $3)',
            [email, otp, expiresAt]
        );

        // Send email
        await sendOTPEmail(email, otp);

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            'SELECT * FROM otp_codes WHERE email = $1 AND code = $2 AND expires_at > NOW()',
            [email, otp]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Delete used OTP
        await pool.query('DELETE FROM otp_codes WHERE email = $1', [email]);

        res.json({ verified: true });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

// Signup
router.post('/signup', async (req, res) => {
    const { email, password, name, referralCode } = req.body;
    const pool = req.app.locals.pool;

    try {
        // Check if email exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const userId = generateUserId();
        const userReferralCode = generateReferralCode();

        // Find referrer if code provided
        let referredById = null;
        if (referralCode) {
            const referrer = await pool.query(
                'SELECT id FROM users WHERE referral_code = $1',
                [referralCode]
            );
            if (referrer.rows.length > 0) {
                referredById = referrer.rows[0].id;
            }
        }

        // Create user with 100 XP welcome bonus
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, name, user_id, referral_code, referred_by, xp)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, user_id, xp, referral_code`,
            [email, passwordHash, name, userId, userReferralCode, referredById, 100]
        );

        const user = result.rows[0];

        // Award referrer XP
        if (referredById) {
            await pool.query('UPDATE users SET xp = xp + 100 WHERE id = $1', [referredById]);
            // Award referee extra XP
            await pool.query('UPDATE users SET xp = xp + 50 WHERE id = $1', [user.id]);
        }

        // Create default settings
        await pool.query(
            'INSERT INTO user_settings (user_id) VALUES ($1)',
            [user.id]
        );

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                userId: user.user_id,
                xp: referredById ? 150 : 100,
                referralCode: user.referral_code
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Daily login XP bonus
        const today = new Date().toISOString().split('T')[0];
        let xpAwarded = 0;

        if (!user.last_login_xp_date || user.last_login_xp_date.toISOString().split('T')[0] !== today) {
            await pool.query(
                'UPDATE users SET xp = xp + 100, last_login_xp_date = $1 WHERE id = $2',
                [today, user.id]
            );
            xpAwarded = 100;
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                userId: user.user_id,
                xp: user.xp + xpAwarded,
                referralCode: user.referral_code
            },
            xpAwarded
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Verify token / Get current user
router.get('/me', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            'SELECT id, email, name, user_id, bio, avatar_url, xp, referral_code FROM users WHERE id = $1',
            [req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

module.exports = router;
