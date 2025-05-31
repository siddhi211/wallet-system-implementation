import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:3000';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 10;
  const walletId = localStorage.getItem('walletId');

  useEffect(() => {
    if (walletId) {
      fetchTransactions();
    }
  }, [walletId]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE}/transactions/?walletId=${walletId}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    const aVal = sortBy === 'date' ? new Date(a.date) : a.amount;
    const bVal = sortBy === 'date' ? new Date(b.date) : b.amount;
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Amount', 'Balance', 'Description'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.amount,
        t.balance,
        t.description
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  };

  if (!walletId) {
    return (
      <div style={{ padding: '20px' }}>
        <p>No wallet found. <Link to="/">Go back to setup</Link></p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Transactions</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'blue' }}>← Back to Wallet</Link>
        <button onClick={exportCSV} style={{ marginLeft: '20px', padding: '5px 10px' }}>
          Export CSV
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Sort by: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: '10px' }}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Amount</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Balance</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {paginatedTransactions.map((transaction) => (
            <tr key={transaction._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(transaction.date).toLocaleDateString()}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.type}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${transaction.amount}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>${transaction.balance}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
          disabled={currentPage === 1}
          style={{ marginRight: '10px' }}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
          disabled={currentPage === totalPages}
          style={{ marginLeft: '10px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TransactionsPage;