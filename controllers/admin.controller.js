const db = require('../models');
const Admin = db.Admin;

exports.createAdmin = async (req, res) => {
  try {
    const { username, email, mobile, password, role, acode } = req.body;

    // Validate required fields
    if (!username || !email || !mobile || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // For agents, acode is required and must belong to an existing admin
    if (role === 'agent') {
      if (!acode) {
        return res.status(400).json({ message: 'Admin code is required for agent registration' });
      }

      const validAdmin = await Admin.findOne({ where: { acode, role: 'admin' } });
      if (!validAdmin) {
        return res.status(400).json({ message: 'Invalid admin code provided' });
      }
    }

    // Check for existing user
    const existing = await Admin.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ username }, { email }, { mobile }],
      },
    });

    if (existing) {
      return res.status(409).json({ message: 'User already exists with same username/email/mobile' });
    }

    // Prepare new user object
    const newUserData = {
      username,
      email,
      mobile,
      password,
      role,
    };

    // If admin, generate acode
    if (role === 'admin') {
      newUserData.acode = generateAcode();
    } else if (role === 'agent') {
      newUserData.acode = acode; // copy from request if agent
    }

    const newUser = await Admin.create(newUserData);

    return res.status(201).json({
      message: 'User registered successfully',
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      mobile: newUser.mobile,
      role: newUser.role,
      acode: newUser.acode,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Utility function to generate random 8-character alphanumeric code
function generateAcode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase(); // 8 chars
}
