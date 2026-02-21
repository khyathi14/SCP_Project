const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const AWS = require('aws-sdk');
const https = require('https');
require('dotenv').config();

const Transaction = require('./models/transaction');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://khyathiv:vSwYDOnX38FCbSi5@cluster0.3wpl6sp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// AWS Configuration (for SNS notifications)
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const sns = new AWS.SNS();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ============================================
// SNS NOTIFICATION HELPER
// ============================================
async function sendSNSNotification(subject, message) {
  const topicArn = process.env.SNS_TOPIC_ARN;
  
  if (!topicArn) {
    console.warn('SNS_TOPIC_ARN not configured, skipping notification');
    return;
  }

  try {
    const params = {
      Subject: subject,
      Message: message,
      TopicArn: topicArn
    };
    
    await sns.publish(params).promise();
    console.log('SNS notification sent successfully');
  } catch (error) {
    console.error('Error sending SNS notification:', error);
  }
}

// ============================================
// TRANSACTION CRUD API ROUTES
// ============================================

// Get all transactions with optional filters
app.get('/api/transactions', async (req, res) => {
  try {
    const { type, category, startDate, endDate, currency } = req.query;
    
    let query = {};
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (currency) query.currency = currency;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single transaction
app.get('/api/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const transaction = new Transaction(req.body);
    await transaction.save();
    
    // Send SNS notification for new transaction
    await sendSNSNotification(
      `New ${transaction.type} added`,
      `A new ${transaction.type} of ${transaction.amount} ${transaction.currency} has been added.\nCategory: ${transaction.category}\nDescription: ${transaction.description}\nDate: ${transaction.date}`
    );
    
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ANALYTICS & STATISTICS ROUTES
// ============================================

// Get summary statistics
app.get('/api/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate, currency } = req.query;
    
    let query = {};
    if (currency) query.currency = currency;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(query);
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;
    
    // Category breakdown
    const categoryBreakdown = {};
    transactions.forEach(t => {
      if (!categoryBreakdown[t.category]) {
        categoryBreakdown[t.category] = { income: 0, expense: 0 };
      }
      categoryBreakdown[t.category][t.type] += t.amount;
    });
    
    res.json({
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length,
      categoryBreakdown
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly trends
app.get('/api/stats/monthly', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: 1 });
    
    const monthlyData = {};
    
    transactions.forEach(t => {
      const monthKey = new Date(t.date).toISOString().substring(0, 7); // YYYY-MM
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }
      
      monthlyData[monthKey][t.type] += t.amount;
    });
    
    res.json(monthlyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SNS SUBSCRIPTION ENDPOINT
// ============================================
app.post('/api/sns/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const topicArn = process.env.SNS_TOPIC_ARN;
    
    if (!topicArn) {
      return res.status(400).json({ error: 'SNS Topic not configured' });
    }
    
    const params = {
      Protocol: 'email',
      TopicArn: topicArn,
      Endpoint: email
    };
    
    const result = await sns.subscribe(params).promise();
    res.json({ 
      message: 'Subscription request sent. Please check your email to confirm.',
      subscriptionArn: result.SubscriptionArn 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// CURRENCY CONVERTER PROXY ENDPOINTS
// ============================================

// Helper function to make HTTPS requests using native fetch
async function makeHttpsRequest(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Node.js-server/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Get list of available currencies
app.get('/api/currencies', async (req, res) => {
  try {
    const url = 'https://2p9nh463r1.execute-api.us-east-1.amazonaws.com/prod/currencies';
    console.log('Fetching currencies from:', url);
    
    const data = await makeHttpsRequest(url);
    console.log('Currencies response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching currencies:', error);
    res.status(500).json({ error: 'Failed to load currencies', details: error.message });
  }
});

// Convert currency using AWS Lambda API
app.get('/api/currency/convert', async (req, res) => {
  try {
    const { from, to, amount } = req.query;
    
    if (!from || !to || !amount) {
      return res.status(400).json({ error: 'Missing required parameters: from, to, amount' });
    }
    
    const url = `https://2p9nh463r1.execute-api.us-east-1.amazonaws.com/prod/convert?from=${from}&to=${to}&amount=${amount}`;
    console.log('Converting currency:', { from, to, amount });
    
    const data = await makeHttpsRequest(url);
    console.log('Conversion result:', data);
    
    res.json(data);
  } catch (error) {
    console.error('Error converting currency:', error);
    res.status(500).json({ error: 'Currency conversion failed', details: error.message });
  }
});

// ============================================
// QUOTES PROXY ENDPOINT
// ============================================

app.get('/api/quotes/random', async (req, res) => {
  try {
    const url = 'https://zdrsuikerb.execute-api.us-east-1.amazonaws.com/quotes/random';
    console.log('Fetching quote from:', url);

    const data = await makeHttpsRequest(url);
    console.log('Quote fetched successfully:', data);
    res.json(data);
    console.log('Quote response sent to client');
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    res.status(500).json({ error: 'Failed to load quote', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Personal Finance Tracker Server running on http://localhost:${PORT}`);
});
