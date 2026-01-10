const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/:id', async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        // Try to find by numeric id or user_id
        const result = await pool.query(
            `SELECT id, email, name, user_id, bio, currently_exploring, working_on,
              avatar_url, xp, skills, github_url, linkedin_url, twitter_url,
              category, level, created_at
       FROM users WHERE id = $1 OR user_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        // Get user badges
        const badges = await pool.query(
            `SELECT b.* FROM badges b
       JOIN user_badges ub ON b.id = ub.badge_id
       WHERE ub.user_id = $1`,
            [user.id]
        );

        // Get post count
        const postCount = await pool.query(
            'SELECT COUNT(*) FROM posts WHERE user_id = $1',
            [user.id]
        );

        // Get connection count
        const connectionCount = await pool.query(
            `SELECT COUNT(*) FROM friendships
       WHERE (requester_id = $1 OR addressee_id = $1) AND status = 'accepted'`,
            [user.id]
        );

        res.json({
            ...user,
            badges: badges.rows,
            postCount: parseInt(postCount.rows[0].count),
            connectionCount: parseInt(connectionCount.rows[0].count)
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { name, bio, currentlyExploring, workingOn, avatarUrl, skills, githubUrl, linkedinUrl, twitterUrl } = req.body;

    try {
        const result = await pool.query(
            `UPDATE users SET
        name = COALESCE($1, name),
        bio = COALESCE($2, bio),
        currently_exploring = COALESCE($3, currently_exploring),
        working_on = COALESCE($4, working_on),
        avatar_url = COALESCE($5, avatar_url),
        skills = COALESCE($6, skills),
        github_url = COALESCE($7, github_url),
        linkedin_url = COALESCE($8, linkedin_url),
        twitter_url = COALESCE($9, twitter_url),
        updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
            [name, bio, currentlyExploring, workingOn, avatarUrl, skills, githubUrl, linkedinUrl, twitterUrl, req.userId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Update user ID
router.put('/user-id', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { userId } = req.body;

    try {
        if (!userId || userId.length < 3) {
            return res.status(400).json({ error: 'User ID must be at least 3 characters' });
        }

        // Check if user ID is taken
        const existing = await pool.query(
            'SELECT id FROM users WHERE user_id = $1 AND id != $2',
            [userId, req.userId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'User ID already taken' });
        }

        await pool.query(
            'UPDATE users SET user_id = $1, updated_at = NOW() WHERE id = $2',
            [userId, req.userId]
        );

        res.json({ success: true, userId });
    } catch (error) {
        console.error('Update user ID error:', error);
        res.status(500).json({ error: 'Failed to update user ID' });
    }
});

// Get user settings
router.get('/settings/me', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            'SELECT * FROM user_settings WHERE user_id = $1',
            [req.userId]
        );

        if (result.rows.length === 0) {
            // Create default settings
            const newSettings = await pool.query(
                'INSERT INTO user_settings (user_id) VALUES ($1) RETURNING *',
                [req.userId]
            );
            return res.json(newSettings.rows[0]);
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Failed to get settings' });
    }
});

// Update settings
router.put('/settings', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { profileVisibility, notificationIntensity } = req.body;

    try {
        const result = await pool.query(
            `UPDATE user_settings SET
        profile_visibility = COALESCE($1, profile_visibility),
        notification_intensity = COALESCE($2, notification_intensity),
        updated_at = NOW()
       WHERE user_id = $3
       RETURNING *`,
            [profileVisibility, notificationIntensity, req.userId]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

module.exports = router;
