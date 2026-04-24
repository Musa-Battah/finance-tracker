import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard({ summary, transactions }) {
const categoryData = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
        const amount = Number(transaction.amount); // Convert to number
        const existing = acc.find(item => item.name === transaction.category);
        if (existing) {
            existing.value += amount;
        } else {
            acc.push({ name: transaction.category, value: amount });
        }
    }
    return acc;
}, []);
    
    const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    
    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            
            <div className="summary-cards">
                <div className="card income">
                    <h3>Total Income</h3>
                    <p>${summary.totalIncome.toFixed(2)}</p>
                </div>
                <div className="card expense">
                    <h3>Total Expenses</h3>
                    <p>${summary.totalExpenses.toFixed(2)}</p>
                </div>
                <div className="card balance">
                    <h3>Balance</h3>
                    <p style={{ color: summary.balance >= 0 ? 'green' : 'red' }}>
                        ${summary.balance.toFixed(2)}
                    </p>
                </div>
            </div>
            
            {categoryData.length > 0 && (
                <div className="chart-container">
                    <h3>Spending by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default Dashboard;