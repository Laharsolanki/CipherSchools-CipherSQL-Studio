const express = require('express');
const router = express.Router();

// Fetch the in-memory pg pool initialized in server.js
const getPool = () => global.pgPool;


router.post('/', async (req, res) => {
    const { query, assignmentId } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'SQL query is required' });
    }

    // Basic Sanity/Security Check (Very basic for a Sandbox)
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('drop ') || lowerQuery.includes('delete from') || lowerQuery.includes('truncate') || lowerQuery.includes('alter table')) {
        return res.status(403).json({ error: 'Destructive queries are not allowed in the sandbox.' });
    }

    try {
        // Execute query
        const pool = getPool();
        if (!pool) {
            return res.status(500).json({ error: 'Database pool not initialized yet.' });
        }
        const client = await pool.connect();
        try {
            // In a real sandbox, you'd run this under a restricted Postgres user
            const result = await client.query(query);
            res.json({
                fields: result.fields.map(f => f.name),
                rows: result.rows,
                rowCount: result.rowCount
            });
        } finally {
            client.release();
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
