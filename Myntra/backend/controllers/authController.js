const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'myntraheritagesecretkey12345', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, phone, and password' });
    }

    // Check email uniqueness
    const userExistsEmail = await User.findOne({ email: email.toLowerCase() });
    if (userExistsEmail) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Check phone uniqueness
    const userExistsPhone = await User.findOne({ phone });
    if (userExistsPhone) {
      return res.status(400).json({ success: false, message: 'User with this phone number already exists' });
    }

    // Determine role (for developer testing, standard register with 'admin' in email or role parameter makes it an admin)
    let assignedRole = 'user';
    if (role === 'admin' || email.toLowerCase().includes('admin') || email.toLowerCase().startsWith('admin@')) {
      assignedRole = 'admin';
    }

    // Create new user record
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: assignedRole,
    });

    if (user) {
      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid user registration input' });
    }
  } catch (error) {
    console.error(`Register error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Login user with Email or Phone
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email or phone, and password' });
    }

    const trimmedInput = emailOrPhone.trim();

    // Check email or phone matching
    const user = await User.findOne({
      $or: [{ email: trimmedInput.toLowerCase() }, { phone: trimmedInput }],
    });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email, phone number, or password' });
    }
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      return res.json({
        success: true,
        data: user,
      });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error(`Get profile error: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
