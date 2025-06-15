const db = require('../models');
const Repayment = db.Repayment;
const Loan = db.Loan;

exports.create = async (req, res) => {
  try {
    const { loanId, amount, paymentDate } = req.body;

    if (!loanId || !amount || !paymentDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if loan exists
    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Create repayment
    const repayment = await Repayment.create({ loanId, amount, paymentDate });

    // Update loan.amountPaid
    loan.amountPaid += amount;
    await loan.save();

    res.status(201).json({ message: 'Repayment recorded', data: repayment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getByLoan = async (req, res) => {
  try {
    const { loanId } = req.params;

    const repayments = await Repayment.findAll({
      where: { loanId },
      order: [['paymentDate', 'ASC']],
    });

    res.status(200).json({ message: 'Repayment history fetched', data: repayments });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
