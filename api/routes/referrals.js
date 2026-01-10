const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get my referral code
router.get('/my-code', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            'SELECT referral_code FROM users WHERE id = $1',
            [req.userId]
        );

        res.json({ referralCode: result.rows[0].referral_code });
    } catch (error) {
        console.error('Get referral code error:', error);
        res.status(500).json({ error: 'Failed to get referral code' });
    }
});

// Get my referrals
router.get('/my-referrals', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            `SELECT id, name, user_id, avatar_url, xp, created_at
       FROM users WHERE referred_by = $1
       ORDER BY created_at DESC`,
            [req.userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get referrals error:', error);
        res.status(500).json({ error: 'Failed to get referrals' });
    }
});

// Validate referral code
router.get('/validate/:code', async (req, res) => {
    const pool = req.app.locals.pool;
    const { code } = req.params;

    try {
        const result = await pool.query(
            'SELECT name, user_id FROM users WHERE referral_code = $1',
            [code]
        );

        if (result.rows.length === 0) {
            return res.json({ valid: false });
        }

        res.json({
            valid: true,
            referrer: result.rows[0]
        });
    } catch (error) {
        console.error('Validate code error:', error);
        res.status(500).json({ error: 'Validation failed' });
    }
});

// Apply referral code (for existing users who didn't use one during signup)
router.post('/apply', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { code } = req.body;

    try {
        // Check if user already has a referrer
        const currentUser = await pool.query(
            'SELECT referred_by FROM users WHERE id = $1',
            [req.userId]
        );

        if (currentUser.rows[0].referred_by) {
            return res.status(400).json({ error: 'You already used a referral code' });
        }

        // Find referrer
        const referrer = await pool.query(
            'SELECT id FROM users WHERE referral_code = $1',
            [code]
        );

        if (referrer.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid referral code' });
        }

        const referrerId = referrer.rows[0].id;

        if (referrerId === req.userId) {
            return res.status(400).json({ error: 'Cannot use your own code' });
        }

        // Apply referral
        await pool.query(
            'UPDATE users SET referred_by = $1, xp = xp + 50 WHERE id = $2',
            [referrerId, req.userId]
        );

        // Award referrer
        await pool.query(
            'UPDATE users SET xp = xp + 100 WHERE id = $1',
            [referrerId]
        );

        res.json({ success: true, xpAwarded: 50 });
    } catch (error) {
        console.error('Apply referral error:', error);
        res.status(500).json({ error: 'Failed to apply referral' });
    }
});

// Referral leaderboard
router.get('/leaderboard', async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            `SELECT u.id, u.name, u.user_id, u.avatar_url, COUNT(r.id) as referral_count
       FROM users u
       LEFT JOIN users r ON r.referred_by = u.id
       GROUP BY u.id
       HAVING COUNT(r.id) > 0
       ORDER BY referral_count DESC
       LIMIT 10`
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Failed to get leaderboard' });
    }
});

module.exports = router;
