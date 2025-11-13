import express from 'express';
import WeatherData from '../models/WeatherData.js';

const router = express.Router();

// @route   GET /api/weather
// @desc    Get weather data by location
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { municipality, province } = req.query;

    if (!municipality || !province) {
      return res.status(400).json({
        success: false,
        message: 'Please provide municipality and province'
      });
    }

    const weather = await WeatherData.findOne({
      'location.municipality': new RegExp(municipality, 'i'),
      'location.province': new RegExp(province, 'i')
    }).sort('-date');

    if (!weather) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not found for this location'
      });
    }

    res.json({
      success: true,
      weather
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/weather/forecast
// @desc    Get weather forecast
// @access  Public
router.get('/forecast', async (req, res, next) => {
  try {
    const { municipality, province, days = 7 } = req.query;

    const weather = await WeatherData.findOne({
      'location.municipality': new RegExp(municipality, 'i'),
      'location.province': new RegExp(province, 'i')
    }).sort('-date');

    if (!weather || !weather.forecast) {
      return res.status(404).json({
        success: false,
        message: 'Forecast not available'
      });
    }

    const forecast = weather.forecast.slice(0, parseInt(days));

    res.json({
      success: true,
      location: weather.location,
      forecast
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/weather/advisories
// @desc    Get active weather advisories
// @access  Public
router.get('/advisories', async (req, res, next) => {
  try {
    const { municipality, province } = req.query;
    
    const query = {};
    if (municipality) query['location.municipality'] = new RegExp(municipality, 'i');
    if (province) query['location.province'] = new RegExp(province, 'i');

    const weatherData = await WeatherData.find(query)
      .sort('-date')
      .limit(1);

    if (!weatherData.length) {
      return res.json({
        success: true,
        advisories: []
      });
    }

    const activeAdvisories = weatherData[0].advisories.filter(
      advisory => new Date(advisory.validUntil) > new Date()
    );

    res.json({
      success: true,
      count: activeAdvisories.length,
      advisories: activeAdvisories
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/weather
// @desc    Add weather data (Admin/System only in production)
// @access  Public (should be Private/Admin in production)
router.post('/', async (req, res, next) => {
  try {
    const weather = await WeatherData.create(req.body);

    res.status(201).json({
      success: true,
      weather
    });
  } catch (error) {
    next(error);
  }
});

export default router;
