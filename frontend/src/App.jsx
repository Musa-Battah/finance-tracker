import React, { useState, useEffect } from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import BudgetProgress from './components/BudgetProgress';
import SavingsGoals from './components/SavingsGoals';
import { getTransactions, createTransaction, deleteTransaction, getSummary } from './api/api';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [transactionsRes, summaryRes] = await Promise.all([
                getTransactions(),
                getSummary()
            ]);
            setTransactions(transactionsRes.data);
            setSummary(summaryRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading data:', err);
            setLoading(false);
        }
    };

    const handleAddTransaction = async (transactionData) => {
        try {
            const response = await createTransaction(transactionData);
            setTransactions([response.data, ...transactions]);
            const summaryRes = await getSummary();
            setSummary(summaryRes.data);
        } catch (err) {
            console.error('Error adding transaction:', err);
            alert('Failed to add transaction');
        }
    };

    const handleDeleteTransaction = async (id) => {
        try {
            await deleteTransaction(id);
            setTransactions(transactions.filter(t => t.id !== id));
            const summaryRes = await getSummary();
            setSummary(summaryRes.data);
        } catch (err) {
            console.error('Error deleting transaction:', err);
            alert('Failed to delete transaction');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="app-container">
            <h1>Personal Finance Tracker</h1>
            
            <div className="tabs">
                <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
                <button onClick={() => setActiveTab('budgets')}>Budgets</button>
                <button onClick={() => setActiveTab('savings')}>Savings Goals</button>
                <button onClick={() => setActiveTab('transactions')}>Transactions</button>
            </div>

            {activeTab === 'dashboard' && (
                <>
                    <Dashboard summary={summary} transactions={transactions} />
                    <TransactionForm onAddTransaction={handleAddTransaction} />
                </>
            )}

            {activeTab === 'budgets' && (
                <BudgetProgress />
            )}

            {activeTab === 'savings' && (
                <SavingsGoals />
            )}

            {activeTab === 'transactions' && (
                <TransactionList 
                    transactions={transactions} 
                    onDelete={handleDeleteTransaction}
                />
            )}
        </div>
    );
}

export default App;