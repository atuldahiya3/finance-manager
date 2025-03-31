const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

// @route   GET api/expense
// @desc    Get all expense entries
// @access  Private
router.get('/', auth, expenseController.getAllExpenses);

// @route   POST api/expense
// @desc    Add an expense entry
// @access  Private
router.post('/', auth, expenseController.addExpense);

// @route   PUT api/expense/:id
// @desc    Update expense entry
// @access  Private
router.put('/:id', auth, expenseController.updateExpense);

// @route   DELETE api/expense/:id
// @desc    Delete expense entry
// @access  Private
router.delete('/:id', auth, expenseController.deleteExpense);

// @route   GET api/expense/categories
// @desc    Get all expense categories
// @access  Private
router.get('/categories', auth, expenseController.getAllCategories);

// @route   POST api/expense/categories
// @desc    Add an expense category
// @access  Private
router.post('/categories', auth, expenseController.addCategory);

// @route   PUT api/expense/categories/:id
// @desc    Update expense category
// @access  Private
router.put('/categories/:id', auth, expenseController.updateCategory);

// @route   DELETE api/expense/categories/:id
// @desc    Delete expense category
// @access  Private
router.delete('/categories/:id', auth, expenseController.deleteCategory);

// @route   GET api/expense/summary
// @desc    Get expense summary
// @access  Private
router.get('/summary/data', auth, expenseController.getExpenseSummary);

module.exports = router;