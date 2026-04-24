import React, { useState, useEffect } from 'react';
import { getBudgets } from '../api/api';

function BudgetProgress() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = async () => {
        try {
            const response = await getBudgets();
            setBudgets(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading budgets:', err);
            setLoading(false);
        }
    };

    const getProgressColor = (percentage, status) => {
        if (status === 'over') return '#ff4444';
        if (percentage >= 90) return '#ffaa00';
        return '#4CAF50';
    };

    if (loading) return <div>Loading budgets...</div>;

    if (budgets.length === 0) {
        return (
            <div className="budget-section">
                <h2>Budget Progress</h2>
                <p>No budgets set. Add budgets to track your spending!</p>
            </div>
        );
    }

    return (
        <div className="budget-section">
            <h2>Budget Progress</h2>
            {budgets.map((budget) => (
                <div key={budget.id} className="budget-item">
                    <div className="budget-header">
                        <span className="category-name">{budget.category_name}</span>
                        <span className="budget-amount">
                            ${Number(budget.actual_spent).toFixed(2)} / ${Number(budget.budget_amount).toFixed(2)}
                        </span>
                    </div>
                    <div className="progress-bar-container">
                        <div 
                            className="progress-bar-fill"
                            style={{
                                width: `${Math.min(Number(budget.percentage), 100)}%`,
                                backgroundColor: getProgressColor(Number(budget.percentage), budget.status)
                            }}
                        />
                    </div>
                    <div className="budget-footer">
                        <span className={`status ${budget.status}`}>
                            {budget.status === 'over' && '⚠️ Over budget!'}
                            {budget.status === 'at' && '✓ At budget limit'}
                            {budget.status === 'under' && `${Number(budget.percentage)}% used`}
                        </span>
                        <span className="remaining">
                            ${(Number(budget.budget_amount) - Number(budget.actual_spent)).toFixed(2)} remaining
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default BudgetProgress;