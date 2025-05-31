import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletPage from './components/WalletPage';
import TransactionsPage from './components/TransactionsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WalletPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
