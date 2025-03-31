const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const auth = require('../middleware/auth');

// @route   GET api/stock
// @desc    Get all stock entries
// @access  Private
router.get('/', auth, stockController.getAllStock);

// @route   POST api/stock
// @desc    Add a stock entry
// @access  Private
router.post('/', auth, stockController.addStock);

// @route   GET api/stock/:id
// @desc    Get stock entry by ID
// @access  Private
router.get('/:id', auth, stockController.getStockById);

// @route   PUT api/stock/:id
// @desc    Update stock entry
// @access  Private
router.put('/:id', auth, stockController.updateStock);

// @route   DELETE api/stock/:id
// @desc    Delete stock entry
// @access  Private
router.delete('/:id', auth, stockController.deleteStock);

// @route   GET api/stock/summary
// @desc    Get stock summary
// @access  Private
router.get('/summary/data', auth, stockController.getStockSummary);

module.exports = router;
