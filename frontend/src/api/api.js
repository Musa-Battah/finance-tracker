import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// My Transactions API
export const getTransactions = () => api.get('/transactions');
export const createTransaction = (data) => api.post('/transactions', data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);
export const getSummary = () => api.get('/transactions/summary');

// My Categories API
export const getCategories = () => api.get('/categories');
export const getCategoriesByType = (type) => api.get(`/categories/${type}`);

export default api;

// My Budgets API
export const getBudgets = () => api.get('/budgets');
export const getBudgetsByMonth = (year, month) => api.get(`/budgets/${year}/${month}`);
export const createBudget = (data) => api.post('/budgets', data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);

// My Savings Goals API
export const getSavingsGoals = () => api.get('/savings');
export const createSavingsGoal = (data) => api.post('/savings', data);
export const updateSavingsGoal = (id, current_amount) => api.put(`/savings/${id}`, { current_amount });
export const deleteSavingsGoal = (id) => api.delete(`/savings/${id}`);