const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get all posts (feed)
router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const { limit = 20, offset = 0, spaceId } = req.query;

    try {
        let query = `
      SELECT p.*, u.name as author_name, u.user_id as author_user_id, 
             u.avatar_url as author_avatar, s.name as space_name
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN spaces s ON p.space_id = s.id
    `;

        const params = [];

        if (spaceId) {
            query += ' WHERE p.space_id = $1';
            params.push(spaceId);
        }

        query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json(result.rows);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Failed to get posts' });
    }
});

// Get single post
router.get('/:id', async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT p.*, u.name as author_name, u.user_id as author_user_id,
              u.avatar_url as author_avatar, s.name as space_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN spaces s ON p.space_id = s.id
       WHERE p.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get post error:', error);
        res.status(500).json({ error: 'Failed to get post' });
    }
});

// Create post
router.post('/', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { content, spaceId, artifactUrl, artifactType } = req.body;

    try {
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const result = await pool.query(
            `INSERT INTO posts (user_id, content, space_id, artifact_url, artifact_type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [req.userId, content, spaceId || null, artifactUrl || null, artifactType || null]
        );

        // Get author info
        const author = await pool.query(
            'SELECT name, user_id, avatar_url FROM users WHERE id = $1',
            [req.userId]
        );

        const post = {
            ...result.rows[0],
            author_name: author.rows[0].name,
            author_user_id: author.rows[0].user_id,
            author_avatar: author.rows[0].avatar_url
        };

        // Award XP for posting
        await pool.query(
            'UPDATE users SET xp = xp + 10 WHERE id = $1',
            [req.userId]
        );

        res.status(201).json(post);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found or not authorized' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Get posts by user
router.get('/user/:userId', async (req, res) => {
    const pool = req.app.locals.pool;
    const { userId } = req.params;

    try {
        const user = await pool.query(
            'SELECT id FROM users WHERE id = $1 OR user_id = $1',
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const result = await pool.query(
            `SELECT p.*, u.name as author_name, u.user_id as author_user_id,
              u.avatar_url as author_avatar, s.name as space_name
       FROM posts p
       JOIN users u ON p.user_id = u.id
       LEFT JOIN spaces s ON p.space_id = s.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
            [user.rows[0].id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({ error: 'Failed to get posts' });
    }
});

module.exports = router;
