import express from 'express';
import MarketPrice from '../models/MarketPrice.js';

const router = express.Router();

// @route   GET /api/market-prices
// @desc    Get market prices with filtering
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { category, commodity, province, days } = req.query;
    
    let query = {};
    
    if (category) query.category = category;
    if (commodity) query.commodity = new RegExp(commodity, 'i');
    if (province) query['market.location.province'] = new RegExp(province, 'i');
    
    // Filter by date range
    if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      query.date = { $gte: daysAgo };
    }

    const prices = await MarketPrice.find(query).sort('-date');

    res.json({
      success: true,
      count: prices.length,
      prices
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/market-prices/latest
// @desc    Get latest prices for each commodity
// @access  Public
router.get('/latest', async (req, res, next) => {
  try {
    const { category } = req.query;
    
    const pipeline = [
      ...(category ? [{ $match: { category } }] : []),
      { $sort: { date: -1 } },
      {
        $group: {
          _id: '$commodity',
          latestPrice: { $first: '$$ROOT' }
        }
      },
      { $replaceRoot: { newRoot: '$latestPrice' } }
    ];

    const prices = await MarketPrice.aggregate(pipeline);

    res.json({
      success: true,
      count: prices.length,
      prices
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/market-prices/trends/:commodity
// @desc    Get price trends for a specific commodity
// @access  Public
router.get('/trends/:commodity', async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const trends = await MarketPrice.find({
      commodity: new RegExp(req.params.commodity, 'i'),
      date: { $gte: daysAgo }
    }).sort('date');

    res.json({
      success: true,
      count: trends.length,
      trends
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/market-prices
// @desc    Add market price data (Admin only in production)
// @access  Public (should be Private/Admin in production)
router.post('/', async (req, res, next) => {
  try {
    const price = await MarketPrice.create(req.body);

    res.status(201).json({
      success: true,
      price
    });
  } catch (error) {
    next(error);
  }
});

export default router;
