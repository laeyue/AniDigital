import mongoose from 'mongoose';

const DiagnosisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cropType: {
    type: String,
    required: [true, 'Please specify the crop type'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please upload an image']
  },
  symptoms: [{
    type: String
  }],
  diagnosis: {
    disease: {
      type: String,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    severity: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical'],
      default: 'moderate'
    }
  },
  recommendations: [{
    type: {
      type: String,
      enum: ['chemical', 'organic', 'cultural', 'preventive']
    },
    description: String,
    product: String
  }],
  location: {
    latitude: Number,
    longitude: Number
  },
  status: {
    type: String,
    enum: ['pending', 'diagnosed', 'resolved'],
    default: 'diagnosed'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Diagnosis', DiagnosisSchema);
