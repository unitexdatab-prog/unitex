const express = require('express');
const router = express.Router();

// Search users
router.get('/users', async (req, res) => {
    const pool = req.app.locals.pool;
    const { q, limit = 10 } = req.query;

    try {
        if (!q || q.length < 2) {
            return res.json([]);
        }

        const result = await pool.query(
            `SELECT id, name, user_id, avatar_url, bio, xp
       FROM users
       WHERE name ILIKE $1 OR user_id ILIKE $1 OR email ILIKE $1
       ORDER BY xp DESC
       LIMIT $2`,
            [`%${q}%`, limit]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Search spaces
router.get('/spaces', async (req, res) => {
    const pool = req.app.locals.pool;
    const { q, limit = 10 } = req.query;

    try {
        if (!q || q.length < 2) {
            return res.json([]);
        }

        const result = await pool.query(
            `SELECT s.*, COUNT(sm.user_id) as member_count
       FROM spaces s
       LEFT JOIN space_members sm ON s.id = sm.space_id
       WHERE s.name ILIKE $1 OR s.description ILIKE $1
       GROUP BY s.id
       ORDER BY member_count DESC
       LIMIT $2`,
            [`%${q}%`, limit]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Search spaces error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Search posts
router.get('/posts', async (req, res) => {
    const pool = req.app.locals.pool;
    const { q, limit = 20 } = req.query;

    try {
        if (!q || q.length < 2) {
            return res.json([]);
        }

        const result = await pool.query(
            `SELECT p.*, u.name as author_name, u.user_id as author_user_id, u.avatar_url as author_avatar
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.content ILIKE $1
       ORDER BY p.created_at DESC
       LIMIT $2`,
            [`%${q}%`, limit]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Search posts error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Global search
router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const { q } = req.query;

    try {
        if (!q || q.length < 2) {
            return res.json({ users: [], spaces: [], posts: [] });
        }

        const [users, spaces, posts] = await Promise.all([
            pool.query(
                `SELECT id, name, user_id, avatar_url, bio, xp
         FROM users WHERE name ILIKE $1 OR user_id ILIKE $1 LIMIT 5`,
                [`%${q}%`]
            ),
            pool.query(
                `SELECT s.*, COUNT(sm.user_id) as member_count
         FROM spaces s
         LEFT JOIN space_members sm ON s.id = sm.space_id
         WHERE s.name ILIKE $1
         GROUP BY s.id LIMIT 5`,
                [`%${q}%`]
            ),
            pool.query(
                `SELECT p.*, u.name as author_name, u.user_id as author_user_id
         FROM posts p
         JOIN users u ON p.user_id = u.id
         WHERE p.content ILIKE $1
         ORDER BY p.created_at DESC LIMIT 5`,
                [`%${q}%`]
            )
        ]);

        res.json({
            users: users.rows,
            spaces: spaces.rows,
            posts: posts.rows
        });
    } catch (error) {
        console.error('Global search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;
