import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:3000';

function WalletPage() {
  const [walletId, setWalletId] = useState(localStorage.getItem('walletId'));
  const [wallet, setWallet] = useState(null);
  const [username, setUsername] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('CREDIT');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletId) {
      fetchWallet();
    }
  }, [walletId]);

  const fetchWallet = async () => {
    try {
      const response = await fetch(`${API_BASE}/wallet/${walletId}`);
      if (response.ok) {
        const data = await response.json();
        setWallet(data);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
    }
  };

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
      }
    } catch (error) {
      console.error('Error executing transaction:', error);
    }
    setLoading(false);
  };

  if (!walletId) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Setup Wallet</h2>
        <form onSubmit={setupWallet}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="number"
              placeholder="Initial Balance (optional)"
              value={initialBalance}
              onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
            {loading ? 'Setting up...' : 'Submit'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Wallet Dashboard</h2>
      {wallet && (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h3>{wallet.name}</h3>
          <p>Balance: ${wallet.balance}</p>
        </div>
      )}
      
      <h3>Make Transaction</h3>
      <form onSubmit={executeTransaction}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="radio"
              value="CREDIT"
              checked={transactionType === 'CREDIT'}
              onChange={(e) => setTransactionType(e.target.value)}
            /> Credit
          </label>
          <label style={{ marginLeft: '10px' }}>
            <input
              type="radio"
              value="DEBIT"
              checked={transactionType === 'DEBIT'}
              onChange={(e) => setTransactionType(e.target.value)}
            /> Debit
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px' }}>
          {loading ? 'Processing...' : 'Submit Transaction'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/transactions" style={{ textDecoration: 'none', color: 'blue' }}>
          View Transactions →
        </Link>
      </div>
    </div>
  );
}

export default WalletPage;