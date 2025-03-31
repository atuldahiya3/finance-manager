const Stock = require('../models/Stock');

// Get all stock entries
exports.getAllStock = async (req, res) => {
  try {
    const stock = await Stock.find({ user: req.user.id }).sort({ date: -1 });
    res.json(stock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add stock entry
exports.addStock = async (req, res) => {
  const { itemName, type, vendorName, quantity, unitPrice, totalAmount, notes } = req.body;

  try {
    const newStock = new Stock({
      user: req.user.id,
      itemName,
      type,
      vendorName,
      quantity,
      unitPrice,
      totalAmount,
      notes
    });

    const stock = await newStock.save();
    res.json(stock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get stock entry by ID
exports.getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ msg: 'Stock entry not found' });
    }

    // Make sure user owns the stock entry
    if (stock.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(stock);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Stock entry not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Update stock entry
exports.updateStock = async (req, res) => {
  try {
    let stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ msg: 'Stock entry not found' });
    }

    // Make sure user owns the stock
    if (stock.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    stock = await Stock.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );

    res.json(stock);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete stock entry
exports.deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ msg: 'Stock entry not found' });
    }

    // Make sure user owns the stock
    if (stock.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await stock.remove();
    res.json({ msg: 'Stock entry removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Stock entry not found' });
    }
    res.status(500).send('Server Error');
  }
};

// Get stock summary
exports.getStockSummary = async (req, res) => {
  try {
    const purchases = await Stock.find({ 
      user: req.user.id,
      type: 'purchase'
    });
    
    const sales = await Stock.find({ 
      user: req.user.id,
      type: 'sale'
    });
    
    const totalPurchases = purchases.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalSales = sales.reduce((sum, item) => sum + item.totalAmount, 0);
    
    const summary = {
      totalPurchases,
      totalSales,
      inventory: totalPurchases - totalSales,
      purchaseCount: purchases.length,
      salesCount: sales.length
    };

    res.json(summary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
