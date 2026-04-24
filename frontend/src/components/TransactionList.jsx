import React from 'react';

function TransactionList({ transactions, onDelete }) {
    if (!transactions || transactions.length === 0) {
        return <p>No transactions yet. Add one above!</p>;
    }
    
    return (
        <div className="transaction-list">
            <h2>Recent Transactions</h2>
            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.transaction_date}</td>
                            <td style={{ 
                                color: transaction.type === 'income' ? 'green' : 'red',
                                fontWeight: 'bold'
                            }}>
                                {transaction.type}
                            </td>
                            <td>{transaction.category}</td>
                            <td>{transaction.description || '-'}</td>
                            <td>${Number(transaction.amount).toFixed(2)}</td>
                            <td>
                                <button onClick={() => onDelete(transaction.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionList;