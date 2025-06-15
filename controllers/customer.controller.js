const db = require('../models');
const Customer = db.Customer;
const Admin = db.Admin;

exports.create = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    // Basic validation
    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required.' });
    }

    // Check if customer with same phone already exists under same admin
    const existingCustomer = await Customer.findOne({
      where: {
        phone,
        adminId: req.user.id, // ensure unique per admin
      },
    });
    if (existingCustomer) {
      return res.status(409).json({ message: 'Phone number already exists for this admin.' });
    }

    // Create customer with adminId from JWT
    const customer = await Customer.create({
      name,
      phone,
      address,
      adminId: req.user.id,
    });

    res.status(201).json({
      message: 'Customer created successfully.',
      data: customer,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// exports.getAll = async (req, res) => {
//   try {
//     const customers = await Customer.findAll({
//       where: { adminId: req.user.id },
//     });
//     res.json(customers);
//   } catch (err) {
//     res.status(500).json({ message: 'Internal server error', error: err.message });
//   }
// };

exports.getAllByAdminCode = async (req, res) => {
  try {
    const { acode, role } = req.user;

    // Ensure only agent or admin with acode can access
    if (!acode || !['admin', 'agent'].includes(role)) {
      return res.status(400).json({ message: 'Unauthorized access or missing admin code in token' });
    }

    // Find admin by acode and role = admin
    const admin = await Admin.findOne({
      where: {
        acode,
        role: 'admin',
      },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found with this code' });
    }

    // Fetch customers of the matched admin
    const customers = await Customer.findAll({
      where: { adminId: admin.id },
    });

    res.status(200).json({
      adminId: admin.id,
      total: customers.length,
      customers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
