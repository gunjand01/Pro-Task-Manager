const { promisify } = require('util');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const AppError = require('../error-handler/AppError');

const register = (async (req, res, next) => {
  const { email, name, password, confirmPassword } = req.body;

  // Validate the request body
  if (!email || !name || !password || !confirmPassword) {
    throw new AppError('All fields (email, name, password, confirmPassword) are required!', 400);
  }

  // Additional validation for password confirmation
  if (password !== confirmPassword) {
    throw new AppError('Passwords do not match!', 400);
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered!', 400);
  }

  const user = await User.create({ email, name, password, confirmPassword });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

const login = (async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and Password are required!', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePasswords(password, user.password))) {
    throw new AppError('Email or password mismatch', 400);
  }
  
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    message: 'success',
    data: {
      info: { email: user.email, name: user.name, _id: user._id },
      token,
    },
  });
});



module.exports = {register, login};