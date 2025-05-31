const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Helper function to round to 4 decimal places
const roundToFour = (num) => Math.round(num * 10000) / 10000;

//  Setup wallet - POST /setup
router.post('/setup', async (req, res) => {
  try {
    const { balance, name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required and must be a string' });
    }

    if (balance === undefined || balance === null || typeof balance !== 'number') {
      return res.status(400).json({ error: 'Balance is required and must be a number' });
    }

    if (balance < 0) {
      return res.status(400).json({ error: 'Balance cannot be negative' });
    }

    const roundedBalance = roundToFour(balance);

    // Create wallet
    const wallet = new Wallet({
      name: name.trim(),
      balance: roundedBalance
    });

    await wallet.save();

    // Create initial transaction
    const transaction = new Transaction({
      walletId: wallet._id,
      amount: roundedBalance,
      balance: roundedBalance,
      description: 'Setup',
      type: 'CREDIT'
    });

    await transaction.save();

    res.status(200).json({
      id: wallet._id,
      balance: wallet.balance,
      transactionId: transaction._id,
      name: wallet.name,
      date: wallet.date
    });

  } catch (error) {
    console.error('Setup wallet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Credit/Debit transaction - POST /transact/:walletId
router.post('/transact/:walletId', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { walletId } = req.params;
    console.log('walletId:', walletId, typeof walletId);

    const { amount, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      return res.status(400).json({ error: 'Invalid wallet ID' });
    }

    if (amount === undefined || amount === null || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Amount is required and must be a number' });
    }

    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Description is required and must be a string' });
    }

    const roundedAmount = roundToFour(amount);

    // Find wallet
    const wallet = await Wallet.findOne({ _id: walletId }).session(session)
    if (!wallet) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Calculate new balance
    const newBalance = roundToFour(wallet.balance + roundedAmount);

    // Check for negative balance
    if (newBalance < 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Update wallet balance
    wallet.balance = newBalance;
    await wallet.save({ session });

    // Create transaction
    const transaction = new Transaction({
      walletId: wallet._id,
      amount: roundedAmount,
      balance: newBalance,
      description: description.trim(),
      type: roundedAmount >= 0 ? 'CREDIT' : 'DEBIT'
    });

    await transaction.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      balance: newBalance,
      transactionId: transaction._id
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    session.endSession();
  }
});

// 3. Fetch transactions - GET /transactions
router.get('/transactions', async (req, res) => {
  try {
    const { walletId, skip = 0, limit = 10 } = req.query;

    if (!walletId) {
      return res.status(400).json({ error: 'walletId is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(walletId)) {
      return res.status(400).json({ error: 'Invalid wallet ID' });
    }

    const skipNum = parseInt(skip);
    const limitNum = parseInt(limit);

    if (isNaN(skipNum) || skipNum < 0) {
      return res.status(400).json({ error: 'Skip must be a non-negative number' });
    }

    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
      return res.status(400).json({ error: 'Limit must be between 1 and 100' });
    }

    // Check if wallet exists
    const wallet = await Wallet.findById(walletId);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Fetch transactions
    const transactions = await Transaction.find({ walletId })
      .sort({ date: -1 })
      .skip(skipNum)
      .limit(limitNum)
      .select('_id walletId amount balance description date type');

    // Format response
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id,
      walletId: transaction.walletId,
      amount: transaction.amount,
      balance: transaction.balance,
      description: transaction.description,
      date: transaction.date,
      type: transaction.type
    }));

    res.status(200).json(formattedTransactions);

  } catch (error) {
    console.error('Fetch transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get wallet details - GET /wallet/:id
router.get('/wallet/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid wallet ID' });
    }

    // Find wallet
    const wallet = await Wallet.findById(id);
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.status(200).json({
      id: wallet._id,
      balance: wallet.balance,
      name: wallet.name,
      date: wallet.date
    });

  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;