import mongoose from 'mongoose';

const MarketPriceSchema = new mongoose.Schema({
  commodity: {
    type: String,
    required: [true, 'Please specify commodity name'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetable', 'fruit', 'grain', 'livestock', 'poultry', 'fish']
  },
  variety: {
    type: String,
    trim: true
  },
  price: {
    low: {
      type: Number,
      required: true,
      min: 0
    },
    high: {
      type: Number,
      required: true,
      min: 0
    },
    average: {
      type: Number,
      required: true,
      min: 0
    }
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'gram', 'piece', 'bundle', 'sack', 'liter', 'dozen']
  },
  market: {
    name: String,
    location: {
      municipality: String,
      province: String,
      region: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'DA-AMAS' // Department of Agriculture - Agribusiness Marketing Assistance Service
  },
  priceChange: {
    type: Number,
    default: 0
  },
  trend: {
    type: String,
    enum: ['up', 'down', 'stable'],
    default: 'stable'
  }
}, {
  timestamps: true
});

// Index for faster queries
MarketPriceSchema.index({ commodity: 1, date: -1 });
MarketPriceSchema.index({ category: 1, date: -1 });

export default mongoose.model('MarketPrice', MarketPriceSchema);
