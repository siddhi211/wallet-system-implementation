import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.BACKEND_APP_API_URL || 'http://localhost:3000';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const itemsPerPage = 10;
  const walletId = localStorage.getItem('walletId');

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/transactions/?walletId=${walletId}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [walletId]);

  useEffect(() => {
    if (walletId) {
      fetchTransactions();
    }
  }, [walletId, fetchTransactions]);

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
      <div className="wallet-container">
        <p>No wallet found. <Link to="/">Go back to setup</Link></p>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <h2 style={{ color: '#2c3e50', marginBottom: '30px', textAlign: 'center' }}>💳 Transaction History</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#3498db', fontWeight: 'bold', fontSize: '16px' }}>← Back to Wallet</Link>
        <button 
          onClick={exportCSV} 
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📊 Export CSV
        </button>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 'bold', color: '#2c3e50' }}>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '5px 10px',
              border: '2px solid #bdc3c7',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontWeight: 'bold', color: '#2c3e50' }}>Order:</label>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            style={{
              padding: '5px 10px',
              border: '2px solid #bdc3c7',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>📅 Date</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>🔄 Type</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>💰 Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>💳 Balance</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>📝 Description</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map((transaction, index) => (
              <tr 
                key={transaction._id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  borderBottom: '1px solid #ecf0f1'
                }}
              >
                <td style={{ padding: '12px', color: '#2c3e50' }}>
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: transaction.type === 'CREDIT' ? '#d5f4e6' : '#ffeaa7',
                    color: transaction.type === 'CREDIT' ? '#00b894' : '#fdcb6e'
                  }}>
                    {transaction.type === 'CREDIT' ? '⬆️ CREDIT' : '⬇️ DEBIT'}
                  </span>
                </td>
                <td style={{ 
                  padding: '12px', 
                  fontWeight: 'bold',
                  color: transaction.type === 'CREDIT' ? '#00b894' : '#e17055'
                }}>
                  ${transaction.amount}
                </td>
                <td style={{ padding: '12px', fontWeight: 'bold', color: '#2c3e50' }}>
                  ${transaction.balance}
                </td>
                <td style={{ padding: '12px', color: '#7f8c8d' }}>
                  {transaction.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
          <p style={{ fontSize: '18px' }}>📭 No transactions found</p>
          <p>Start making transactions to see them here!</p>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '15px',
          marginTop: '20px'
        }}>
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === 1 ? '#bdc3c7' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            ⬅️ Previous
          </button>
          <span style={{ 
            padding: '8px 16px',
            backgroundColor: '#ecf0f1',
            borderRadius: '5px',
            fontWeight: 'bold',
            color: '#2c3e50'
          }}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              backgroundColor: currentPage === totalPages ? '#bdc3c7' : '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;