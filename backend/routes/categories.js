const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY type, name');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:type', async (req, res) => {
    const { type } = req.params;
    
    if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Invalid type. Use "income" or "expense"' });
    }
    
    try {
        const result = await pool.query('SELECT * FROM categories WHERE type = $1 ORDER BY name', [type]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;