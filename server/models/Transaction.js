import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity'],
    min: 1
  },
  price: {
    type: Number,
    required: [true, 'Please specify price'],
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank_transfer', 'gcash', 'paymaya', 'cod'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  deliveryAddress: {
    street: String,
    barangay: String,
    municipality: String,
    province: String,
    zipCode: String
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'delivery', 'courier']
  },
  deliveryDate: {
    type: Date
  },
  notes: {
    type: String
  },
  trackingNumber: {
    type: String
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
TransactionSchema.pre('save', function(next) {
  this.totalAmount = this.quantity * this.price;
  next();
});

export default mongoose.model('Transaction', TransactionSchema);
