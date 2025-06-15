const db = require('../models');
const Loan = db.Loan;
const Customer = db.Customer;
const Admin = db.Admin;

// 🔐 Util: Determine adminId based on logged-in user
const getAdminIdFromUser = async (user) => {
  if (user.role === 'admin') return user.id;

  if (user.role === 'agent') {
    const admin = await Admin.findOne({ where: { acode: user.acode, role: 'admin' } });
    if (!admin) throw new Error('Invalid agent: linked admin not found');
    return admin.id;
  }

  throw new Error('Unauthorized role');
};

// ✅ Create Loan (Admin Only)
exports.create = async (req, res) => {
  try {
    const { customerId, amount, durationMonths, interestRate, startDate, frequency } = req.body;

    if (!customerId || !amount || !durationMonths || !interestRate || !startDate || !frequency) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can create loans.' });
    }

    // 🔍 Verify customer belongs to the admin
    const customer = await Customer.findOne({
      where: { id: customerId, adminId: req.user.id },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or does not belong to this admin.' });
    }

    // 📊 Calculate numberOfInstallments and finalAmount
    const weeksPerMonth = 4;
    const numberOfInstallments = frequency === 'weekly'
      ? durationMonths * weeksPerMonth
      : durationMonths;

    const interestAmount = (amount * interestRate * durationMonths) / 1200;
    const finalAmount = amount + interestAmount;

    const loan = await Loan.create({
      customerId,
      amount,
      durationMonths,
      interestRate,
      startDate,
      frequency,
      numberOfInstallments,
      finalAmount,
      amountPaid: 0, // initialize
    });

    res.status(201).json({
      message: 'Loan created successfully.',
      data: loan,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// ✅ Get All Loans (Admin or Agent)
exports.getAll = async (req, res) => {
  try {
    const adminId = await getAdminIdFromUser(req.user);

    const loans = await Loan.findAll({
      include: {
        model: Customer,
        attributes: ['id', 'name', 'phone'],
        where: { adminId },
      },
    });

    res.status(200).json({
      message: 'Loan list fetched successfully.',
      data: loans,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
