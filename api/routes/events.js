const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Get all events
router.get('/', async (req, res) => {
    const pool = req.app.locals.pool;
    const { upcoming } = req.query;

    try {
        let query = `
      SELECT e.*, u.name as creator_name, u.user_id as creator_user_id,
             s.name as space_name, COUNT(er.user_id) as rsvp_count
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      LEFT JOIN spaces s ON e.space_id = s.id
      LEFT JOIN event_rsvps er ON e.id = er.event_id
    `;

        if (upcoming === 'true') {
            query += ' WHERE e.event_date > NOW()';
        }

        query += ' GROUP BY e.id, u.name, u.user_id, s.name ORDER BY e.event_date ASC';

        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({ error: 'Failed to get events' });
    }
});

// Get single event
router.get('/:id', async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        const event = await pool.query(
            `SELECT e.*, u.name as creator_name, u.user_id as creator_user_id,
              s.name as space_name
       FROM events e
       LEFT JOIN users u ON e.created_by = u.id
       LEFT JOIN spaces s ON e.space_id = s.id
       WHERE e.id = $1`,
            [id]
        );

        if (event.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Get RSVPs
        const rsvps = await pool.query(
            `SELECT u.id, u.name, u.user_id, u.avatar_url
       FROM users u
       JOIN event_rsvps er ON u.id = er.user_id
       WHERE er.event_id = $1`,
            [id]
        );

        // Get reflections
        const reflections = await pool.query(
            `SELECT er.*, u.name as author_name, u.user_id as author_user_id, u.avatar_url
       FROM event_reflections er
       JOIN users u ON er.user_id = u.id
       WHERE er.event_id = $1
       ORDER BY er.created_at DESC`,
            [id]
        );

        res.json({
            ...event.rows[0],
            rsvps: rsvps.rows,
            reflections: reflections.rows
        });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({ error: 'Failed to get event' });
    }
});

// Create event
router.post('/', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { title, description, eventDate, location, spaceId } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO events (title, description, event_date, location, space_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [title, description, eventDate, location, spaceId || null, req.userId]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// RSVP to event
router.post('/:id/rsvp', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        await pool.query(
            'INSERT INTO event_rsvps (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, req.userId]
        );

        // Award XP
        await pool.query('UPDATE users SET xp = xp + 10 WHERE id = $1', [req.userId]);

        res.json({ success: true });
    } catch (error) {
        console.error('RSVP error:', error);
        res.status(500).json({ error: 'Failed to RSVP' });
    }
});

// Cancel RSVP
router.delete('/:id/rsvp', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        await pool.query(
            'DELETE FROM event_rsvps WHERE event_id = $1 AND user_id = $2',
            [id, req.userId]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Cancel RSVP error:', error);
        res.status(500).json({ error: 'Failed to cancel RSVP' });
    }
});

// Add reflection
router.post('/:id/reflect', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;
    const { content } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO event_reflections (event_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [id, req.userId, content]
        );

        // Award XP for reflection
        await pool.query('UPDATE users SET xp = xp + 20 WHERE id = $1', [req.userId]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Add reflection error:', error);
        res.status(500).json({ error: 'Failed to add reflection' });
    }
});

// Check RSVP status
router.get('/:id/rsvp-status', authMiddleware, async (req, res) => {
    const pool = req.app.locals.pool;
    const { id } = req.params;

    try {
        const result = await pool.query(
            'SELECT * FROM event_rsvps WHERE event_id = $1 AND user_id = $2',
            [id, req.userId]
        );

        res.json({ hasRsvp: result.rows.length > 0 });
    } catch (error) {
        console.error('Check RSVP error:', error);
        res.status(500).json({ error: 'Failed to check RSVP' });
    }
});

module.exports = router;
