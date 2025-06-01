import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const formatNumber = (amount) => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

function WalletPage() {
  const [walletId, setWalletId] = useState(localStorage.getItem('walletId'));
  const [wallet, setWallet] = useState(null);
  const [username, setUsername] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('CREDIT');
  const [loading, setLoading] = useState(false);

  const fetchWallet = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/wallet/${walletId}`);
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  }, [walletId]);

  useEffect(() => {
    if (walletId) {
      fetchWallet();
    }
  }, [walletId, fetchWallet]);

  const setupWallet = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, balance: initialBalance })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('walletId', data.id);
        setWalletId(data.id);
        setWallet(data);
      }
    } catch (error) {
      console.error('Error setting up wallet:', error);
    }
    setLoading(false);
  };

  const executeTransaction = async (e) => {
    e.preventDefault();
    
    // Add validation for debit transactions
    if (transactionType === 'DEBIT') {
      const debitAmount = Math.abs(parseFloat(amount));
      if (debitAmount > wallet.balance) {
        alert(`Insufficient balance! You cannot debit $${debitAmount.toFixed(2)} when your current balance is $${wallet.balance.toFixed(2)}.`);
        return;
      }
    }
    
    setLoading(true);
    try {
      const transactionAmount = transactionType === 'DEBIT' ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
      const response = await fetch(`${API_BASE}/transact/${walletId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: transactionAmount, 
          description: `${transactionType} transaction` 
        })
      });
      if (response.ok) {
        fetchWallet();
        setAmount('');
      } else {
        // Handle server errors
        const errorData = await response.json();
        alert(`Transaction failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error executing transaction:', error);
      alert('Transaction failed. Please try again.');
    }
    setLoading(false);
  };

  if (!walletId) {
    return (
      <div className="wallet-container">
        <h1 style={{ marginBottom: '30px', color: '#333' }}>💰 Create Pro Wallet 💳</h1>
        <form onSubmit={setupWallet}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="number"
              placeholder="Initial Balance (optional)"
              onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
              style={{ 
                width: '100%', 
                padding: '15px', 
                border: '2px solid #e0e0e0', 
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%', 
              padding: '15px', 
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px'
            }}
          >
            {loading ? 'Setting up...' : 'Create Wallet'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Wallet Dashboard</h2>
      
      {wallet && (
        <div style={{ 
          marginBottom: '30px', 
          padding: '25px', 
          border: '2px solid #007bff', 
          borderRadius: '10px',
          backgroundColor: '#f8f9fa',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#007bff', fontSize: '20px' }}>
            Welcome, {wallet.name}!
          </h3>
          <p style={{ 
            margin: '0', 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#333'
          }}>
            Balance: ${formatNumber(wallet.balance)}
          </p>
        </div>
      )}
      
      <h3 style={{ marginBottom: '20px', color: '#333' }}>Make Transaction</h3>
      
      <form onSubmit={executeTransaction}>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="number"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '15px', 
              border: '2px solid #e0e0e0', 
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '25px', textAlign: 'left' }}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                value="CREDIT"
                checked={transactionType === 'CREDIT'}
                onChange={(e) => setTransactionType(e.target.value)}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              /> 
              <span style={{ fontSize: '16px' }}>Credit (Add Money)</span>
            </label>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                value="DEBIT"
                checked={transactionType === 'DEBIT'}
                onChange={(e) => setTransactionType(e.target.value)}
                style={{ marginRight: '10px', transform: 'scale(1.2)' }}
              /> 
              <span style={{ fontSize: '16px' }}>Debit (Spend Money)</span>
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            width: '100%', 
            padding: '15px', 
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '8px'
          }}
        >
          {loading ? 'Processing...' : 'Submit Transaction'}
        </button>
      </form>
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link 
          to="/transactions" 
          style={{ 
            textDecoration: 'none', 
            color: '#007bff', 
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          View Transaction History →
        </Link>
      </div>
    </div>
  );
}

export default WalletPage;