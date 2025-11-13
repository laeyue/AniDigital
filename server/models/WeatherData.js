import mongoose from 'mongoose';

const WeatherDataSchema = new mongoose.Schema({
  location: {
    municipality: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    region: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  current: {
    temperature: {
      type: Number,
      required: true
    },
    feelsLike: Number,
    humidity: {
      type: Number,
      min: 0,
      max: 100
    },
    windSpeed: Number,
    windDirection: String,
    precipitation: Number,
    condition: {
      type: String,
      enum: ['clear', 'partly_cloudy', 'cloudy', 'rainy', 'stormy', 'foggy']
    },
    uvIndex: {
      type: Number,
      min: 0,
      max: 11
    }
  },
  forecast: [{
    date: Date,
    tempHigh: Number,
    tempLow: Number,
    precipitation: Number,
    rainChance: Number,
    condition: String
  }],
  advisories: [{
    type: {
      type: String,
      enum: ['typhoon', 'heavy_rain', 'drought', 'flood', 'frost', 'heat_wave']
    },
    severity: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical']
    },
    message: String,
    validFrom: Date,
    validUntil: Date
  }],
  farmingRecommendations: [{
    activity: String,
    recommendation: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'PAGASA' // Philippine Atmospheric, Geophysical and Astronomical Services Administration
  }
}, {
  timestamps: true
});

// Index for location-based queries
WeatherDataSchema.index({ 'location.municipality': 1, 'location.province': 1, date: -1 });

export default mongoose.model('WeatherData', WeatherDataSchema);
