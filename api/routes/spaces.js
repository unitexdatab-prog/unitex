const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get all spaces
router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const { category, trending } = req.query;

    try {
        let query = `
      SELECT s.*, COUNT(sm.user_id) as member_count,
             u.name as creator_name
      FROM spaces s
      LEFT JOIN space_members sm ON s.id = sm.space_id
      LEFT JOIN users u ON s.created_by = u.id
    `;

        const conditions = [];
        const params = [];

        if (category) {
            params.push(category);
            conditions.push(`s.category = $${params.length}`);
        }

        if (trending === 'true') {
            conditions.push('s.is_trending = true');
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' GROUP BY s.id, u.name ORDER BY member_count DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get spaces error:', error);
        res.status(500).json({ error: 'Failed to get spaces' });
    }
});

// Get single space
router.get('/:id', async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        const space = await pool.query(
            `SELECT s.*, u.name as creator_name, u.user_id as creator_user_id
       FROM spaces s
       LEFT JOIN users u ON s.created_by = u.id
       WHERE s.id = $1`,
            [id]
        );

        if (space.rows.length === 0) {
            return res.status(404).json({ error: 'Space not found' });
        }

        // Get members
        const members = await pool.query(
            `SELECT u.id, u.name, u.user_id, u.avatar_url
       FROM users u
       JOIN space_members sm ON u.id = sm.user_id
       WHERE sm.space_id = $1`,
            [id]
        );

        res.json({
            ...space.rows[0],
            members: members.rows
        });
    } catch (error) {
        console.error('Get space error:', error);
        res.status(500).json({ error: 'Failed to get space' });
    }
});

// Create space
router.post('/', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { name, description, category } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO spaces (name, description, category, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
            [name, description || '', category || 'general', req.userId]
        );

        // Auto-join creator
        await pool.query(
            'INSERT INTO space_members (space_id, user_id) VALUES ($1, $2)',
            [result.rows[0].id, req.userId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create space error:', error);
        res.status(500).json({ error: 'Failed to create space' });
    }
});

// Join space
router.post('/:id/join', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        await pool.query(
            'INSERT INTO space_members (space_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, req.userId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Join space error:', error);
        res.status(500).json({ error: 'Failed to join space' });
    }
});

// Leave space
router.post('/:id/leave', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        await pool.query(
            'DELETE FROM space_members WHERE space_id = $1 AND user_id = $2',
            [id, req.userId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Leave space error:', error);
        res.status(500).json({ error: 'Failed to leave space' });
    }
});

// Check membership
router.get('/:id/membership', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM space_members WHERE space_id = $1 AND user_id = $2',
            [id, req.userId]
        );

        res.json({ isMember: result.rows.length > 0 });
    } catch (error) {
        console.error('Check membership error:', error);
        res.status(500).json({ error: 'Failed to check membership' });
    }
});

module.exports = router;
