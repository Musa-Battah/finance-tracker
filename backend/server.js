const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes (we'll create these next)
const transactionRoutes = require('./routes/transactions');
const categoryRoutes = require('./routes/categories');

app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Finance Tracker API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const budgetRoutes = require('./routes/budgets');
const savingsRoutes = require('./routes/savings');

app.use('/api/budgets', budgetRoutes);
app.use('/api/savings', savingsRoutes);
