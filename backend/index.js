const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const walletRoutes = require('./routes/walletRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // This allows all origins - good for development
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/', walletRoutes);

// Checking whether the backend is running or not
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Wallet System Backend is running!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});