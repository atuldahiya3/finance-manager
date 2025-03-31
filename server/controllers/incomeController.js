const Income = require('../models/Income');
const IncomeCategory = require('../models/IncomeCategory');

// Get all income entries
exports.getAllIncome = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id })
      .populate('category', 'name')
      .sort({ date: -1 });
    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add income entry
exports.addIncome = async (req, res) => {
  const { category, amount, description, date, reference } = req.body;

  try {
    const newIncome = new Income({
      user: req.user.id,
      category,
      amount,
      description,
      date,
      reference
    });

    const income = await newIncome.save();
    await income.populate('category', 'name');
    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update income entry
exports.updateIncome = async (req, res) => {
  try {
    let income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ msg: 'Income entry not found' });
    }

    // Make sure user owns the income entry
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    income = await Income.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    ).populate('category', 'name');

    res.json(income);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete income entry
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income) {
      return res.status(404).json({ msg: 'Income entry not found' });
    }

    // Make sure user owns the income
    if (income.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Income.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Income entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all income categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await IncomeCategory.find({ user: req.user.id });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add income category
exports.addCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCategory = new IncomeCategory({
      user: req.user.id,
      name,
      description
    });

    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update income category
exports.updateCategory = async (req, res) => {
  try {
    let category = await IncomeCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Make sure user owns the category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    category = await IncomeCategory.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    );

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete income category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await IncomeCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Make sure user owns the category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check if category is used in any income entries
    const inUse = await Income.findOne({ category: req.params.id });
    if (inUse) {
      return res.status(400).json({ msg: 'Cannot delete category in use' });
    }

    await IncomeCategory.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get income summary
exports.getIncomeSummary = async (req, res) => {
  try {
    const income = await Income.find({ user: req.user.id });
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    
    // Get income by category
    const categories = await IncomeCategory.find({ user: req.user.id });
    
    const categoryTotals = await Promise.all(
      categories.map(async (category) => {
        const incomeByCategory = await Income.find({
          user: req.user.id,
          category: category._id
        });
        
        const total = incomeByCategory.reduce((sum, item) => sum + item.amount, 0);
        
        return {
          category: category.name,
          total
        };
      })
    );
    
    res.json({
      totalIncome,
      categoryTotals
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
