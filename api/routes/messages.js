const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get conversations
router.get('/conversations', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;

    try {
        const result = await pool.query(
            `SELECT c.id, c.created_at,
              json_agg(json_build_object(
                'id', u.id,
                'name', u.name,
                'user_id', u.user_id,
                'avatar_url', u.avatar_url
              )) as participants
       FROM conversations c
       JOIN conversation_participants cp ON c.id = cp.conversation_id
       JOIN users u ON cp.user_id = u.id
       WHERE c.id IN (
         SELECT conversation_id FROM conversation_participants WHERE user_id = $1
       )
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
            [req.userId]
        );

        // Get last message for each conversation
        for (let conv of result.rows) {
            const lastMessage = await pool.query(
                `SELECT content, created_at, sender_id FROM messages
         WHERE conversation_id = $1
         ORDER BY created_at DESC LIMIT 1`,
                [conv.id]
            );
            conv.lastMessage = lastMessage.rows[0] || null;
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Failed to get conversations' });
    }
});

// Get messages in conversation
router.get('/conversations/:id', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        // Verify user is participant
        const participant = await pool.query(
            'SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [id, req.userId]
        );

        if (participant.rows.length === 0) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const messages = await pool.query(
            `SELECT m.*, u.name as sender_name, u.user_id as sender_user_id, u.avatar_url as sender_avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC`,
            [id]
        );

        res.json(messages.rows);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Failed to get messages' });
    }
});

// Send message
router.post('/conversations/:id', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    const { content } = req.body;

    try {
        // Verify user is participant
        const participant = await pool.query(
            'SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2',
            [id, req.userId]
        );

        if (participant.rows.length === 0) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const result = await pool.query(
            `INSERT INTO messages (conversation_id, sender_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [id, req.userId, content]
        );

        // Get sender info
        const sender = await pool.query(
            'SELECT name, user_id, avatar_url FROM users WHERE id = $1',
            [req.userId]
        );

        res.status(201).json({
            ...result.rows[0],
            sender_name: sender.rows[0].name,
            sender_user_id: sender.rows[0].user_id,
            sender_avatar: sender.rows[0].avatar_url
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// Start new conversation
router.post('/start', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { userId } = req.body;

    try {
        // Get target user
        const targetUser = await pool.query(
            'SELECT id FROM users WHERE id = $1 OR user_id = $1',
            [userId]
        );

        if (targetUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const targetId = targetUser.rows[0].id;

        // Check if conversation already exists
        const existing = await pool.query(
            `SELECT c.id FROM conversations c
       JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = $1
       JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = $2
       WHERE (SELECT COUNT(*) FROM conversation_participants WHERE conversation_id = c.id) = 2`,
            [req.userId, targetId]
        );

        if (existing.rows.length > 0) {
            return res.json({ conversationId: existing.rows[0].id, existing: true });
        }

        // Create new conversation
        const conversation = await pool.query(
            'INSERT INTO conversations DEFAULT VALUES RETURNING id'
        );

        const convId = conversation.rows[0].id;

        // Add participants
        await pool.query(
            'INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)',
            [convId, req.userId, targetId]
        );

        res.status(201).json({ conversationId: convId, existing: false });
    } catch (error) {
        console.error('Start conversation error:', error);
        res.status(500).json({ error: 'Failed to start conversation' });
    }
});

module.exports = router;
