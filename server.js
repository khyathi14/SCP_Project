const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const Conversion = require('./models/conversion');

const app = express();
const PORT = process.env.PORT || 3000;

// MONGO_URI=mongodb+srv://khyathiv:vSwYDOnX38FCbSi5@cluster0.3wpl6sp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


// MongoDB Connection
mongoose.connect('mongodb+srv://khyathiv:vSwYDOnX38FCbSi5@cluster0.3wpl6sp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Get all conversion records
app.get('/api/conversions', async (req, res) => {
  try {
    const conversions = await Conversion.find().sort({ createdAt: -1 });
    res.json(conversions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single conversion record
app.get('/api/conversions/:id', async (req, res) => {
  try {
    const conversion = await Conversion.findById(req.params.id);
    if (!conversion) {
      return res.status(404).json({ error: 'Conversion not found' });
    }
    res.json(conversion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new conversion record
app.post('/api/conversions', async (req, res) => {
  try {
    const conversion = new Conversion(req.body);
    await conversion.save();
    res.status(201).json(conversion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a conversion record
app.put('/api/conversions/:id', async (req, res) => {
  try {
    const conversion = await Conversion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!conversion) {
      return res.status(404).json({ error: 'Conversion not found' });
    }
    res.json(conversion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a conversion record
app.delete('/api/conversions/:id', async (req, res) => {
  try {
    const conversion = await Conversion.findByIdAndDelete(req.params.id);
    if (!conversion) {
      return res.status(404).json({ error: 'Conversion not found' });
    }
    res.json({ message: 'Conversion deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
