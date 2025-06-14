const db = require('../models');
const Loan = db.Loan;
const Customer = db.Customer;

// Only admin can create loan for customers under them
exports.create = async (req, res) => {
  try {
    const { customerId, amount, durationMonths, interestRate, startDate } = req.body;

    // Validate input
    if (!customerId || !amount || !durationMonths || !interestRate || !startDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can create loans.' });
    }

    // Check if customer exists under this admin
    const customer = await Customer.findOne({
      where: {
        id: customerId,
        adminId: req.user.id,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or does not belong to this admin.' });
    }

    // Create loan
    const loan = await Loan.create({ customerId, amount, durationMonths, interestRate, startDate });

    res.status(201).json({
      message: 'Loan created successfully.',
      data: loan,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

const getAdminIdFromUser = async (user) => {
  if (user.role === 'admin') {
    return user.id;
  }

  if (user.role === 'agent') {
    const admin = await Admin.findOne({
      where: {
        acode: user.acode,
        role: 'admin',
      },
    });

    if (!admin) {
      throw new Error('Invalid agent: linked admin not found');
    }

    return admin.id;
  }

  throw new Error('Invalid role');
};

exports.getAll = async (req, res) => {
  try {
    const adminId = await getAdminIdFromUser(req.user);

    const loans = await Loan.findAll({
      include: {
        model: Customer,
        attributes: ['id', 'name', 'phone'],
        where: {
          adminId,
        },
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
