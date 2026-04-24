const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                *,
                CASE 
                    WHEN current_amount >= target_amount THEN 'completed'
                    WHEN CURRENT_DATE > target_date THEN 'failed'
                    ELSE 'active'
                END as status,
                (target_amount - current_amount) as remaining,
                (current_amount::float / NULLIF(target_amount, 0)::float) * 100 as progress_percentage,
                (target_date - CURRENT_DATE) as days_remaining
            FROM savings_goals
            ORDER BY target_date ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /savings:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// POST create savings goal
router.post('/', async (req, res) => {
    const { name, target_amount, current_amount, target_date, notes } = req.body;
    
    if (!name || !target_amount || !target_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const result = await pool.query(
            `INSERT INTO savings_goals (name, target_amount, current_amount, target_date, notes) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [name, target_amount, current_amount || 0, target_date, notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error in POST /savings:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { current_amount } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE savings_goals 
             SET current_amount = $1 
             WHERE id = $2 
             RETURNING *`,
            [current_amount, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in PUT /savings/:id:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        await pool.query('DELETE FROM savings_goals WHERE id = $1', [id]);
        res.json({ message: 'Goal deleted' });
    } catch (err) {
        console.error('Error in DELETE /savings/:id:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;