const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
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
  placeFound: {
    type: String,
    required: true,
    trim: true
  },
  dateFound: {
    type: Date,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  contactInfo: {
    type: String,
    required: true
  },
  pickupLocation: {
    type: String,
    default: 'Student Center - Lost & Found Office'
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
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
foundItemSchema.index({ itemName: 'text', description: 'text', placeFound: 'text' });
foundItemSchema.index({ category: 1, status: 1 });
foundItemSchema.index({ userId: 1 });

module.exports = mongoose.model('FoundItem', foundItemSchema);
