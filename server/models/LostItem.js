const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Documents', 'Clothing', 'Accessories', 'Books', 'Keys', 'ID Cards', 'Wallets', 'Others']
  },
  placeLost: {
    type: String,
    required: true,
    trim: true
  },
  dateLost: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  validationQuestions: [{
    question: {
      type: String,
      required: true
    },
    expectedAnswer: {
      type: String,
      required: true
    }
  }],
  contactInfo: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'claimed', 'resolved'],
    default: 'active'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimedAt: {
    type: Date,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
lostItemSchema.index({ itemName: 'text', description: 'text', placeLost: 'text' });
lostItemSchema.index({ category: 1, status: 1 });
lostItemSchema.index({ userId: 1 });

module.exports = mongoose.model('LostItem', lostItemSchema);
