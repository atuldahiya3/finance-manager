const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');
const auth = require('../middleware/auth');

// @route   GET api/income
// @desc    Get all income entries
// @access  Private
router.get('/', auth, incomeController.getAllIncome);

// @route   POST api/income
// @desc    Add an income entry
// @access  Private
router.post('/', auth, incomeController.addIncome);

// @route   PUT api/income/:id
// @desc    Update income entry
// @access  Private
router.put('/:id', auth, incomeController.updateIncome);

// @route   DELETE api/income/:id
// @desc    Delete income entry
// @access  Private
router.delete('/:id', auth, incomeController.deleteIncome);

// @route   GET api/income/categories
// @desc    Get all income categories
// @access  Private
router.get('/categories', auth, incomeController.getAllCategories);

// @route   POST api/income/categories
// @desc    Add an income category
// @access  Private
router.post('/categories', auth, incomeController.addCategory);

// @route   PUT api/income/categories/:id
// @desc    Update income category
// @access  Private
router.put('/categories/:id', auth, incomeController.updateCategory);

// @route   DELETE api/income/categories/:id
// @desc    Delete income category
// @access  Private
router.delete('/categories/:id', auth, incomeController.deleteCategory);

// @route   GET api/income/summary
// @desc    Get income summary
// @access  Private
router.get('/summary/data', auth, incomeController.getIncomeSummary);

module.exports = router;
