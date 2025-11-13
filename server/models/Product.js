import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['vegetable', 'fruit', 'grain', 'livestock', 'poultry', 'dairy', 'seeds', 'fertilizer', 'equipment', 'other']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Please specify a unit'],
    enum: ['kg', 'gram', 'piece', 'bundle', 'sack', 'liter', 'dozen']
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify quantity'],
    min: 0
  },
  images: [{
    type: String
  }],
  location: {
    barangay: String,
    municipality: String,
    province: String
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'inactive'],
    default: 'available'
  },
  organic: {
    type: Boolean,
    default: false
  },
  harvestDate: {
    type: Date
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for text search
ProductSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', ProductSchema);
