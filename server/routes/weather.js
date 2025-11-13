import express from 'express';
import axios from 'axios';
import WeatherData from '../models/WeatherData.js';

const router = express.Router();

// WeatherAPI.com configuration
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'c003cb3eae35425698d160114251311';
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1';

// Helper function to fetch weather from WeatherAPI.com
async function fetchLiveWeather(location) {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${WEATHER_API_BASE_URL}/current.json`, {
        params: {
          key: WEATHER_API_KEY,
          q: location,
          aqi: 'yes'
        }
      }),
      axios.get(`${WEATHER_API_BASE_URL}/forecast.json`, {
        params: {
          key: WEATHER_API_KEY,
          q: location,
          days: 7,
          aqi: 'no',
          alerts: 'yes'
        }
      })
    ]);

    return {
      current: currentRes.data,
      forecast: forecastRes.data
    };
  } catch (error) {
    console.error('WeatherAPI.com Error:', error.response?.data || error.message);
    return null;
  }
}

// Helper to generate farming advisories based on weather
function generateAdvisories(current, alerts = []) {
  const advisories = [];
  const temp = current.temp_c;
  const humidity = current.humidity;
  const condition = current.condition.text;
  const uvIndex = current.uv;

  // Add official alerts first
  if (alerts && alerts.length > 0) {
    alerts.forEach(alert => {
      advisories.push({
        type: 'warning',
        title: alert.headline || 'Weather Alert',
        message: alert.desc || alert.event,
        validUntil: new Date(alert.expires)
      });
    });
  }

  // Temperature advisories
  if (temp > 35) {
    advisories.push({
      type: 'warning',
      title: 'High Temperature Alert',
      message: 'Extreme heat detected. Ensure adequate irrigation and provide shade for crops and livestock.',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  } else if (temp < 15) {
    advisories.push({
      type: 'info',
      title: 'Cool Temperature',
      message: 'Cooler weather detected. Monitor frost-sensitive crops.',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  }

  // Humidity advisories
  if (humidity > 80) {
    advisories.push({
      type: 'info',
      title: 'High Humidity',
      message: 'Monitor crops for fungal diseases. Improve air circulation and avoid overhead irrigation.',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  }

  // Rain/storm advisories
  if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('storm')) {
    advisories.push({
      type: 'warning',
      title: 'Rainfall Expected',
      message: 'Ensure proper drainage to prevent waterlogging. Delay fertilizer application.',
      validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000)
    });
  }

  // UV advisories
  if (uvIndex >= 8) {
    advisories.push({
      type: 'info',
      title: 'High UV Index',
      message: 'Protect workers from sun exposure. Consider shade structures for sensitive crops.',
      validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000)
    });
  }

  return advisories;
}

// @route   GET /api/weather
// @desc    Get weather data by location (with WeatherAPI.com integration)
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

    // Create location query for WeatherAPI.com
    const locationQuery = `${municipality}, ${province}, Philippines`;
    
    const liveWeather = await fetchLiveWeather(locationQuery);

    if (liveWeather && liveWeather.current) {
      const current = liveWeather.current.current;
      const forecast = liveWeather.forecast.forecast.forecastday;
      const alerts = liveWeather.forecast.alerts?.alert || [];

      // Transform WeatherAPI.com data to our format
      const weatherData = {
        location: {
          municipality: municipality,
          province: province,
          coordinates: [liveWeather.current.location.lon, liveWeather.current.location.lat]
        },
        date: new Date(),
        temperature: current.temp_c,
        humidity: current.humidity,
        rainfall: current.precip_mm,
        windSpeed: current.wind_kph,
        conditions: current.condition.text,
        forecast: forecast.map(day => ({
          date: new Date(day.date),
          temperature: {
            high: day.day.maxtemp_c,
            low: day.day.mintemp_c
          },
          conditions: day.day.condition.text,
          precipitation: `${day.day.daily_chance_of_rain}%`,
          rainfall: day.day.totalprecip_mm
        })),
        advisories: generateAdvisories(current, alerts)
      };

      // Save to database for offline access
      try {
        await WeatherData.findOneAndUpdate(
          {
            'location.municipality': municipality,
            'location.province': province
          },
          weatherData,
          { upsert: true, new: true }
        );
      } catch (dbError) {
        console.error('DB save error:', dbError.message);
      }

      return res.json({
        success: true,
        weather: weatherData,
        source: 'live'
      });
    }

    // Fallback to database if API fails
    const weather = await WeatherData.findOne({
      'location.municipality': new RegExp(municipality, 'i'),
      'location.province': new RegExp(province, 'i')
    }).sort('-date');

    if (!weather) {
      return res.status(404).json({
        success: false,
        message: 'Weather data not available'
      });
    }

    res.json({
      success: true,
      weather,
      source: 'database'
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
