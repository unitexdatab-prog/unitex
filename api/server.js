const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Make pool accessible to routes
app.locals.pool = pool;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/spaces', require('./routes/spaces'));
app.use('/api/events', require('./routes/events'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/vault', require('./routes/vault'));
app.use('/api/friends', require('./routes/friends'));
app.use('/api/search', require('./routes/search'));
app.use('/api/referrals', require('./routes/referrals'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'UniteX API is running' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
    console.log(`UniteX API running on port ${PORT}`);
});
