const db = require('../models');
const Repayment = db.Repayment;

exports.create = async (req, res) => {
  try {
    const repayment = await Repayment.create(req.body);
    res.status(201).json(repayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const repayments = await Repayment.findAll();
    res.json(repayments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
