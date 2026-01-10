const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get vault items
router.get('/', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            `SELECT vi.*, p.content, p.artifact_url, p.artifact_type, p.created_at as post_created_at,
              u.name as author_name, u.user_id as author_user_id, u.avatar_url as author_avatar
       FROM vault_items vi
       JOIN posts p ON vi.post_id = p.id
       JOIN users u ON p.user_id = u.id
       WHERE vi.user_id = $1
       ORDER BY vi.saved_at DESC`,
            [req.userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Get vault items error:', error);
        res.status(500).json({ error: 'Failed to get vault items' });
    }
});

// Save to vault
router.post('/save/:postId', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { postId } = req.params;
    const { note } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO vault_items (user_id, post_id, note)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING *`,
            [req.userId, postId, note || null]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Already saved' });
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Save to vault error:', error);
        res.status(500).json({ error: 'Failed to save' });
    }
});

// Remove from vault
router.delete('/unsave/:postId', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { postId } = req.params;

    try {
        await pool.query(
            'DELETE FROM vault_items WHERE user_id = $1 AND post_id = $2',
            [req.userId, postId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Remove from vault error:', error);
        res.status(500).json({ error: 'Failed to remove' });
    }
});

// Check if saved
router.get('/check/:postId', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { postId } = req.params;

    try {
        const result = await pool.query(
            'SELECT id FROM vault_items WHERE user_id = $1 AND post_id = $2',
            [req.userId, postId]
        );

        res.json({ saved: result.rows.length > 0 });
    } catch (error) {
        console.error('Check saved error:', error);
        res.status(500).json({ error: 'Failed to check' });
    }
});

// Update note
router.put('/:id/note', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    const { note } = req.body;

    try {
        const result = await pool.query(
            'UPDATE vault_items SET note = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [note, id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ error: 'Failed to update note' });
    }
});

module.exports = router;
