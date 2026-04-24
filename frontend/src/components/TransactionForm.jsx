import React, { useState, useEffect } from 'react';
import { getCategoriesByType } from '../api/api';

function TransactionForm({ onAddTransaction }) {
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, [type]);

    const loadCategories = async () => {
        try {
            const response = await getCategoriesByType(type);
            setCategories(response.data);
            if (response.data.length > 0) {
                setCategory(response.data[0].name);
            }
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!amount || !category || !date) {
            alert('Please fill in required fields');
            return;
        }
        
        const transactionData = {
            type,
            amount: parseFloat(amount),
            category,
            description,
            transaction_date: date
        };
        
        await onAddTransaction(transactionData);
        
        // Clear form
        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <form className="transaction-form" onSubmit={handleSubmit}>
            <h2>Add Transaction</h2>
            
            <div>
                <label>Type</label>
                <div>
                    <button 
                        type="button"
                        onClick={() => setType('expense')}
                        style={{ backgroundColor: type === 'expense' ? '#ff4444' : '#ddd' }}
                    >
                        Expense
                    </button>
                    <button 
                        type="button"
                        onClick={() => setType('income')}
                        style={{ backgroundColor: type === 'income' ? '#44ff44' : '#ddd' }}
                    >
                        Income
                    </button>
                </div>
            </div>
            
            <div>
                <label>Amount ($)</label>
                <input 
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            
            <div>
                <label>Category</label>
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            
            <div>
                <label>Description</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="2"
                />
            </div>
            
            <div>
                <label>Date</label>
                <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            
            <button type="submit">Add Transaction</button>
        </form>
    );
}

export default TransactionForm;