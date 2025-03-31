const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const auth = require('../middleware/auth');

// @route   GET api/invoice
// @desc    Get all invoices
// @access  Private
router.get('/', auth, invoiceController.getAllInvoices);

// @route   POST api/invoice
// @desc    Add a new invoice
// @access  Private
router.post('/', auth, invoiceController.addInvoice);

// @route   GET api/invoice/:id
// @desc    Get invoice by ID
// @access  Private
router.get('/:id', auth, invoiceController.getInvoiceById);

// @route   PUT api/invoice/:id
// @desc    Update invoice
// @access  Private
router.put('/:id', auth, invoiceController.updateInvoice);

// @route   DELETE api/invoice/:id
// @desc    Delete invoice
// @access  Private
router.delete('/:id', auth, invoiceController.deleteInvoice);

// @route   PATCH api/invoice/:id/status
// @desc    Update invoice status
// @access  Private
router.patch('/:id/status', auth, invoiceController.updateInvoiceStatus);

// @route   GET api/invoice/summary
// @desc    Get invoice summary
// @access  Private
router.get('/summary/data', auth, invoiceController.getInvoiceSummary);

// @route   GET api/invoice/generate-number
// @desc    Generate next invoice number
// @access  Private
router.get('/generate/number', auth, invoiceController.generateInvoiceNumber);

module.exports = router;