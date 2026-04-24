const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, type, amount::FLOAT, category, description, transaction_date, created_at FROM transactions ORDER BY transaction_date DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/summary', async (req, res) => {
    try {
        const incomeResult = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = $1',
            ['income']
        );
        
        const expenseResult = await pool.query(
            'SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = $1',
            ['expense']
        );
        
        res.json({
            totalIncome: parseFloat(incomeResult.rows[0].total),
            totalExpenses: parseFloat(expenseResult.rows[0].total),
            balance: parseFloat(incomeResult.rows[0].total) - parseFloat(expenseResult.rows[0].total)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


router.post('/', async (req, res) => {
    const { type, amount, category, description, transaction_date } = req.body;
    
    if (!type || !amount || !category || !transaction_date) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const result = await pool.query(
            'INSERT INTO transactions (type, amount, category, description, transaction_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [type, amount, category, description, transaction_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;