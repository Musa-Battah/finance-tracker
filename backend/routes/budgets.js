const express = require('express');
const router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                b.id,
                b.category_id,
                c.name as category_name,
                c.type,
                b.month,
                b.amount as budget_amount,
                COALESCE(SUM(t.amount), 0) as actual_spent,
                CASE 
                    WHEN COALESCE(SUM(t.amount), 0) > b.amount THEN 'over'
                    WHEN COALESCE(SUM(t.amount), 0) = b.amount THEN 'at'
                    ELSE 'under'
                END as status,
                ROUND(((COALESCE(SUM(t.amount), 0)::numeric / NULLIF(b.amount, 0)::numeric) * 100)::numeric, 2) as percentage
            FROM budgets b
            JOIN categories c ON b.category_id = c.id
            LEFT JOIN transactions t ON t.category = c.name 
                AND t.type = 'expense'
                AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', b.month)
            GROUP BY b.id, c.name, c.type
            ORDER BY b.month DESC, c.name
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /budgets:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});


router.get('/:year/:month', async (req, res) => {
    const { year, month } = req.params;
    
    try {
        const result = await pool.query(`
            SELECT 
                b.id,
                b.category_id,
                c.name as category_name,
                b.amount as budget_amount,
                COALESCE(SUM(t.amount), 0) as actual_spent
            FROM budgets b
            JOIN categories c ON b.category_id = c.id
            LEFT JOIN transactions t ON t.category = c.name 
                AND t.type = 'expense'
                AND EXTRACT(YEAR FROM t.transaction_date) = $1::int
                AND EXTRACT(MONTH FROM t.transaction_date) = $2::int
            WHERE EXTRACT(YEAR FROM b.month) = $1::int 
                AND EXTRACT(MONTH FROM b.month) = $2::int
            GROUP BY b.id, c.name
            ORDER BY c.name
        `, [year, month]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error in GET /budgets/:year/:month:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

router.post('/', async (req, res) => {
    const { category_id, month, amount } = req.body;
    
    if (!category_id || !month || amount === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
        const result = await pool.query(
            `INSERT INTO budgets (category_id, month, amount) 
             VALUES ($1, $2::date, $3) 
             ON CONFLICT (category_id, month) 
             DO UPDATE SET amount = EXCLUDED.amount
             RETURNING *`,
            [category_id, month, amount]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error in POST /budgets:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        await pool.query('DELETE FROM budgets WHERE id = $1', [id]);
        res.json({ message: 'Budget deleted' });
    } catch (err) {
        console.error('Error in DELETE /budgets/:id:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;