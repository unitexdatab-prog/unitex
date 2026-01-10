const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Send friend request
router.post('/request/:userId', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { userId } = req.params;

    try {
        // Get target user id
        const targetUser = await pool.query(
            'SELECT id FROM users WHERE id = $1 OR user_id = $1',
            [userId]
        );

        if (targetUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const targetId = targetUser.rows[0].id;

        if (targetId === req.userId) {
            return res.status(400).json({ error: 'Cannot send request to yourself' });
        }

        // Check if friendship already exists
        const existing = await pool.query(
            `SELECT * FROM friendships WHERE
       (requester_id = $1 AND addressee_id = $2) OR
       (requester_id = $2 AND addressee_id = $1)`,
            [req.userId, targetId]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Request already exists' });
        }

        await pool.query(
            'INSERT INTO friendships (requester_id, addressee_id) VALUES ($1, $2)',
            [req.userId, targetId]
        );

        res.json({ success: true, message: 'Friend request sent' });
    } catch (error) {
        console.error('Send friend request error:', error);
        res.status(500).json({ error: 'Failed to send request' });
    }
});

// Accept friend request
router.put('/accept/:id', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE friendships SET status = 'accepted', updated_at = NOW()
       WHERE id = $1 AND addressee_id = $2 AND status = 'pending'
       RETURNING *`,
            [id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ success: true, message: 'Request accepted' });
    } catch (error) {
        console.error('Accept friend request error:', error);
        res.status(500).json({ error: 'Failed to accept request' });
    }
});

// Reject friend request
router.put('/reject/:id', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE friendships SET status = 'rejected', updated_at = NOW()
       WHERE id = $1 AND addressee_id = $2 AND status = 'pending'
       RETURNING *`,
            [id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ success: true, message: 'Request rejected' });
    } catch (error) {
        console.error('Reject friend request error:', error);
        res.status(500).json({ error: 'Failed to reject request' });
    }
});

// Get friends list
router.get('/', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            `SELECT u.id, u.name, u.user_id, u.avatar_url, u.bio, u.xp
       FROM users u
       JOIN friendships f ON (
         (f.requester_id = $1 AND f.addressee_id = u.id) OR
         (f.addressee_id = $1 AND f.requester_id = u.id)
       )
       WHERE f.status = 'accepted' AND u.id != $1`,
            [req.userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get friends error:', error);
        res.status(500).json({ error: 'Failed to get friends' });
    }
});

// Get pending requests
router.get('/pending', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            `SELECT f.id as request_id, u.id, u.name, u.user_id, u.avatar_url, u.bio, f.created_at
       FROM friendships f
       JOIN users u ON f.requester_id = u.id
       WHERE f.addressee_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
            [req.userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get pending requests error:', error);
        res.status(500).json({ error: 'Failed to get pending requests' });
    }
});

// Get friend suggestions
router.get('/suggestions', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            `SELECT u.id, u.name, u.user_id, u.avatar_url, u.bio, u.xp
       FROM users u
       WHERE u.id != $1
       AND u.id NOT IN (
         SELECT addressee_id FROM friendships WHERE requester_id = $1
         UNION
         SELECT requester_id FROM friendships WHERE addressee_id = $1
       )
       ORDER BY u.xp DESC
       LIMIT 10`,
            [req.userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get suggestions error:', error);
        res.status(500).json({ error: 'Failed to get suggestions' });
    }
});

// Get friendship status with a user
router.get('/status/:userId', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { userId } = req.params;

    try {
        const targetUser = await pool.query(
            'SELECT id FROM users WHERE id = $1 OR user_id = $1',
            [userId]
        );

        if (targetUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const targetId = targetUser.rows[0].id;

        const result = await pool.query(
            `SELECT * FROM friendships WHERE
       (requester_id = $1 AND addressee_id = $2) OR
       (requester_id = $2 AND addressee_id = $1)`,
            [req.userId, targetId]
        );

        if (result.rows.length === 0) {
            return res.json({ status: 'none' });
        }

        const friendship = result.rows[0];
        res.json({
            status: friendship.status,
            isSender: friendship.requester_id === req.userId,
            requestId: friendship.id
        });
    } catch (error) {
        console.error('Get friendship status error:', error);
        res.status(500).json({ error: 'Failed to get status' });
    }
});

module.exports = router;
