import mongoose from 'mongoose';

const FinancialRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },
  category: {
    type: String,
    required: true,
    enum: [
      // Income categories
      'crop_sales', 'livestock_sales', 'government_subsidy', 'loan', 'other_income',
      // Expense categories
      'seeds', 'fertilizer', 'pesticide', 'labor', 'equipment', 'irrigation', 
      'transportation', 'processing', 'marketing', 'rent', 'utilities', 'loan_payment', 'other_expense'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Please specify amount'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  relatedTransaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'gcash', 'paymaya', 'check', 'credit']
  },
  receipt: {
    type: String // URL to receipt image
  },
  notes: {
    type: String
  },
  season: {
    type: String,
    enum: ['wet', 'dry']
  },
  cropCycle: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
FinancialRecordSchema.index({ user: 1, date: -1 });
FinancialRecordSchema.index({ user: 1, type: 1, date: -1 });
FinancialRecordSchema.index({ user: 1, category: 1, date: -1 });

export default mongoose.model('FinancialRecord', FinancialRecordSchema);
