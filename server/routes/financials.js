import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import FinancialRecord from '../models/FinancialRecord.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/financials
// @desc    Get user's financial records
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    
    let query = { user: req.user.id };
    
    if (type) query.type = type;
    if (category) query.category = category;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await FinancialRecord.find(query)
      .populate('relatedProduct', 'name')
      .populate('relatedTransaction', 'status')
      .sort('-date');

    res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/financials/summary
// @desc    Get financial summary
// @access  Private
router.get('/summary', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = { user: req.user.id };
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Calculate totals
    const income = await FinancialRecord.aggregate([
      { $match: { ...dateFilter, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const expenses = await FinancialRecord.aggregate([
      { $match: { ...dateFilter, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Category breakdown
    const categoryBreakdown = await FinancialRecord.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;
    const netProfit = totalIncome - totalExpenses;

    res.json({
      success: true,
      summary: {
        totalIncome,
        totalExpenses,
        netProfit,
        categoryBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/financials/:id
// @desc    Get single financial record
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const record = await FinancialRecord.findById(req.params.id)
      .populate('relatedProduct')
      .populate('relatedTransaction');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Check ownership
    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      record
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/financials
// @desc    Create financial record
// @access  Private
router.post('/', upload.single('receipt'), async (req, res, next) => {
  try {
    const {
      type,
      category,
      amount,
      description,
      date,
      paymentMethod,
      relatedProduct,
      relatedTransaction,
      notes,
      season,
      cropCycle
    } = req.body;

    const receipt = req.file ? `/uploads/${req.file.filename}` : undefined;

    const record = await FinancialRecord.create({
      user: req.user.id,
      type,
      category,
      amount,
      description,
      date: date || Date.now(),
      paymentMethod,
      receipt,
      relatedProduct,
      relatedTransaction,
      notes,
      season,
      cropCycle
    });

    res.status(201).json({
      success: true,
      record
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/financials/:id
// @desc    Update financial record
// @access  Private
router.put('/:id', async (req, res, next) => {
  try {
    let record = await FinancialRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Check ownership
    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    record = await FinancialRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      record
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/financials/:id
// @desc    Delete financial record
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const record = await FinancialRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Record not found'
      });
    }

    // Check ownership
    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await record.deleteOne();

    res.json({
      success: true,
      message: 'Record deleted'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
