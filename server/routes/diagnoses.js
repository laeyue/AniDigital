import express from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import Diagnosis from '../models/Diagnosis.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @route   GET /api/diagnoses
// @desc    Get user's diagnoses
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const diagnoses = await Diagnosis.find({ user: req.user.id })
      .sort('-createdAt');

    res.json({
      success: true,
      count: diagnoses.length,
      diagnoses
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/diagnoses/:id
// @desc    Get single diagnosis
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found'
      });
    }

    // Check ownership
    if (diagnosis.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      diagnosis
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/diagnoses
// @desc    Create a new diagnosis (AI crop scan)
// @access  Private
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const { cropType, symptoms, notes, location } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Mock AI diagnosis - In production, integrate with actual AI model
    const mockDiagnosis = {
      disease: 'Leaf Blight',
      confidence: 85,
      severity: 'moderate'
    };

    const mockRecommendations = [
      {
        type: 'chemical',
        description: 'Apply fungicide every 7 days',
        product: 'Copper-based fungicide'
      },
      {
        type: 'cultural',
        description: 'Remove infected leaves and improve air circulation',
        product: null
      }
    ];

    const diagnosis = await Diagnosis.create({
      user: req.user.id,
      cropType,
      image: `/uploads/${req.file.filename}`,
      symptoms: symptoms ? JSON.parse(symptoms) : [],
      diagnosis: mockDiagnosis,
      recommendations: mockRecommendations,
      location: location ? JSON.parse(location) : undefined,
      notes
    });

    res.status(201).json({
      success: true,
      diagnosis
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/diagnoses/:id
// @desc    Update diagnosis status
// @access  Private
router.put('/:id', async (req, res, next) => {
  try {
    const diagnosis = await Diagnosis.findById(req.params.id);

    if (!diagnosis) {
      return res.status(404).json({
        success: false,
        message: 'Diagnosis not found'
      });
    }

    // Check ownership
    if (diagnosis.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const updated = await Diagnosis.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, notes: req.body.notes },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      diagnosis: updated
    });
  } catch (error) {
    next(error);
  }
});

export default router;
