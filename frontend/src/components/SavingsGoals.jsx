import React, { useState, useEffect } from 'react';
import { getSavingsGoals, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal } from '../api/api';

function SavingsGoals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newGoal, setNewGoal] = useState({
        name: '',
        target_amount: '',
        target_date: '',
        notes: ''
    });

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const response = await getSavingsGoals();
            setGoals(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading goals:', err);
            setLoading(false);
        }
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        try {
            await createSavingsGoal(newGoal);
            setNewGoal({ name: '', target_amount: '', target_date: '', notes: '' });
            setShowForm(false);
            loadGoals();
        } catch (err) {
            console.error('Error creating goal:', err);
            alert('Failed to create goal');
        }
    };

    const handleAddProgress = async (id, current_amount, target_amount) => {
        const additional = prompt('Enter additional amount saved:', '0');
        if (additional) {
            const newAmount = current_amount + parseFloat(additional);
            if (newAmount <= target_amount) {
                await updateSavingsGoal(id, newAmount);
                loadGoals();
            } else {
                alert('Amount exceeds target!');
            }
        }
    };

    const handleDeleteGoal = async (id) => {
        if (window.confirm('Delete this savings goal?')) {
            await deleteSavingsGoal(id);
            loadGoals();
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'completed') return '🎉';
        if (status === 'failed') return '⚠️';
        return '🏦';
    };

    if (loading) return <div>Loading savings goals...</div>;

    return (
        <div className="savings-section">
            <div className="section-header">
                <h2>Savings Goals</h2>
                <button onClick={() => setShowForm(!showForm)} className="add-goal-btn">
                    + Add Goal
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreateGoal} className="goal-form">
                    <input
                        type="text"
                        placeholder="Goal name (e.g., New Car)"
                        value={newGoal.name}
                        onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Target amount"
                        value={newGoal.target_amount}
                        onChange={(e) => setNewGoal({...newGoal, target_amount: parseFloat(e.target.value)})}
                        required
                    />
                    <input
                        type="date"
                        placeholder="Target date"
                        value={newGoal.target_date}
                        onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                        required
                    />
                    <textarea
                        placeholder="Notes (optional)"
                        value={newGoal.notes}
                        onChange={(e) => setNewGoal({...newGoal, notes: e.target.value})}
                    />
                    <button type="submit">Create Goal</button>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}

            {goals.length === 0 && !showForm && (
                <p>No savings goals yet. Add one to start saving!</p>
            )}

            {goals.map((goal) => (
                <div key={goal.id} className={`goal-card ${goal.status}`}>
                    <div className="goal-header">
                        <h3>{getStatusIcon(goal.status)} {goal.name}</h3>
                        <button onClick={() => handleDeleteGoal(goal.id)} className="delete-goal-btn">✖</button>
                    </div>
                    <div className="goal-progress">
                        <div className="goal-stats">
                            <span>${goal.current_amount.toFixed(2)}</span>
                            <span>/ ${goal.target_amount.toFixed(2)}</span>
                        </div>
                        <div className="progress-bar-container">
                            <div 
                                className="progress-bar-fill"
                                style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                            />
                        </div>
                        <div className="goal-details">
                            <span>{goal.progress_percentage.toFixed(1)}% complete</span>
                            <span>{goal.days_remaining} days left</span>
                        </div>
                        {goal.status === 'active' && (
                            <button 
                                onClick={() => handleAddProgress(goal.id, goal.current_amount, goal.target_amount)}
                                className="add-progress-btn"
                            >
                                + Add Progress
                            </button>
                        )}
                        {goal.notes && <p className="goal-notes">📝 {goal.notes}</p>}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SavingsGoals;