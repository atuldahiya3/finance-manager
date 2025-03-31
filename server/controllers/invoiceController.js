// server/controllers/invoiceController.js
const Invoice = require('../models/Invoice');

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id }).sort({ issueDate: -1 });
    res.json(invoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add new invoice
exports.addInvoice = async (req, res) => {
  const { 
    invoiceNumber, 
    customerName, 
    customerAddress, 
    customerEmail, 
    customerPhone, 
    issueDate, 
    dueDate,
    items,
    subtotal,
    taxRate,
    taxAmount,
    discount,
    total,
    notes,
    status,
    paymentMethod
  } = req.body;

  try {
    const newInvoice = new Invoice({
      user: req.user.id,
      invoiceNumber,
      customerName,
      customerAddress,
      customerEmail,
      customerPhone,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      notes,
      status,
      paymentMethod
    });

    const invoice = await newInvoice.save();
    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    // Make sure user owns the invoice
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Invoice not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    // Make sure user owns the invoice
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    invoice = await Invoice.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    // Make sure user owns the invoice
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Invoice.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Invoice removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
  const { status, paymentDate } = req.body;

  try {
    let invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ msg: 'Invoice not found' });
    }

    // Make sure user owns the invoice
    if (invoice.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updateFields = { status };
    if (status === 'paid' && paymentDate) {
      updateFields.paymentDate = paymentDate;
    }

    invoice = await Invoice.findByIdAndUpdate(
      req.params.id, 
      { $set: updateFields }, 
      { new: true }
    );

    res.json(invoice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get invoice summary
exports.getInvoiceSummary = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user.id });
    
    const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid');
    const totalPaid = paidInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const overdueInvoices = invoices.filter(invoice => 
      invoice.status === 'sent' && new Date(invoice.dueDate) < new Date()
    );
    const totalOverdue = overdueInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

    res.json({
      totalInvoiced,
      totalPaid,
      totalOverdue,
      totalPending: totalInvoiced - totalPaid,
      invoiceCount: invoices.length,
      paidCount: paidInvoices.length,
      overdueCount: overdueInvoices.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Generate next invoice number
exports.generateInvoiceNumber = async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne({ user: req.user.id })
      .sort({ invoiceNumber: -1 })
      .limit(1);
    
    let nextNumber = 1;
    if (lastInvoice && lastInvoice.invoiceNumber) {
      // Extract the numeric part if the invoice number has a prefix
      const numericPart = lastInvoice.invoiceNumber.replace(/^\D+/g, '');
      nextNumber = parseInt(numericPart) + 1;
    }
    
    // Format with leading zeros
    const formattedNumber = `INV-${nextNumber.toString().padStart(5, '0')}`;
    
    res.json({ nextInvoiceNumber: formattedNumber });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};