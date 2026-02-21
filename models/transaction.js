const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  tags: [{
    type: String
  }],
  convertedAmount: {
    type: Number,
    default: null
  },
  toCurrency: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
transactionSchema.index({ type: 1, date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ currency: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
