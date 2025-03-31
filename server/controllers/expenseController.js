// server/controllers/expenseController.js
const Expense = require('../models/Expense');
const ExpenseCategory = require('../models/ExpenseCategory');

// Get all expense entries
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .populate('category', 'name')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add expense entry
exports.addExpense = async (req, res) => {
  const { category, amount, description, date, reference } = req.body;

  try {
    const newExpense = new Expense({
      user: req.user.id,
      category,
      amount,
      description,
      date,
      reference
    });

    const expense = await newExpense.save();
    await expense.populate('category', 'name');
    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update expense entry
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: 'Expense entry not found' });
    }

    // Make sure user owns the expense entry
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true }
    ).populate('category', 'name');

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete expense entry
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ msg: 'Expense entry not found' });
    }

    // Make sure user owns the expense entry
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Expense.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Expense entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all expense categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find({ user: req.user.id });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add expense category
exports.addCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newCategory = new ExpenseCategory({
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

// Update expense category
exports.updateCategory = async (req, res) => {
  try {
    let category = await ExpenseCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Make sure user owns the category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    category = await ExpenseCategory.findByIdAndUpdate(
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
exports.getLast7DaysSummary = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const expenses = await Expense.aggregate([
      {
        $match: {
          user: req.user.id,
          date: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json(expenses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Delete expense category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await ExpenseCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    // Make sure user owns the category
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check if category is used in any expense entries
    const inUse = await Expense.findOne({ category: req.params.id });
    if (inUse) {
      return res.status(400).json({ msg: 'Cannot delete category in use' });
    }

    await ExpenseCategory.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get expense summary
exports.getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    // Get expenses by category
    const categories = await ExpenseCategory.find({ user: req.user.id });
    
    const categoryTotals = await Promise.all(
      categories.map(async (category) => {
        const expensesByCategory = await Expense.find({
          user: req.user.id,
          category: category._id
        });
        
        const total = expensesByCategory.reduce((sum, item) => sum + item.amount, 0);
        
        return {
          category: category.name,
          total
        };
      })
    );
    
    res.json({
      totalExpenses,
      categoryTotals
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};