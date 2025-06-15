const db = require('../models');
const Admin = db.Admin;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const admin = await Admin.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: login },
          { mobile: login },
        ],
      },
    });

    if (!admin) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role, acode: admin.acode },
      'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
