import express from 'express';
import { protect } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/transactions
// @desc    Get user's transactions
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const { status, type } = req.query;
    let query = {
      $or: [
        { buyer: req.user.id },
        { seller: req.user.id }
      ]
    };

    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone farmLocation')
      .populate('product', 'name price unit images')
      .sort('-createdAt');

    // Separate buyer and seller transactions if type is specified
    let result = transactions;
    if (type === 'purchases') {
      result = transactions.filter(t => t.buyer._id.toString() === req.user.id);
    } else if (type === 'sales') {
      result = transactions.filter(t => t.seller._id.toString() === req.user.id);
    }

    res.json({
      success: true,
      count: result.length,
      transactions: result
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone farmLocation')
      .populate('product', 'name price unit images category');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check authorization
    if (
      transaction.buyer._id.toString() !== req.user.id &&
      transaction.seller._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      transaction
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const {
      productId,
      sellerId,
      quantity,
      price,
      paymentMethod,
      deliveryAddress,
      deliveryMethod,
      notes
    } = req.body;

    const transaction = await Transaction.create({
      buyer: req.user.id,
      seller: sellerId,
      product: productId,
      quantity,
      price,
      paymentMethod,
      deliveryAddress,
      deliveryMethod,
      notes
    });

    const populated = await Transaction.findById(transaction._id)
      .populate('buyer', 'name email phone')
      .populate('seller', 'name email phone farmLocation')
      .populate('product', 'name price unit images');

    res.status(201).json({
      success: true,
      transaction: populated
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction status
// @access  Private
router.put('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Only buyer or seller can update
    if (
      transaction.buyer.toString() !== req.user.id &&
      transaction.seller.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        paymentStatus: req.body.paymentStatus,
        trackingNumber: req.body.trackingNumber,
        deliveryDate: req.body.deliveryDate
      },
      { new: true, runValidators: true }
    ).populate('buyer seller product');

    res.json({
      success: true,
      transaction: updated
    });
  } catch (error) {
    next(error);
  }
});

export default router;
