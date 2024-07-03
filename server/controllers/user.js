const bcrypt = require('bcrypt');
const User = require('../model/user');
const createError = require('../error-handler/AppError');
const filterObject = (obj, arr) => {
  const updatedObj = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      updatedObj[key] = obj[key];
    }
  });

  return updatedObj;
};

const getUser = (async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { info: { name: user.name, email: user.email, _id: user._id,  myAssignies: user.myAssignies,  } },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user data',
    });
  }
});

const updateUser = (async (req, res, next) => {
  try {
    const { name, newMail, newPassword, oldPassword } = req.body;
    let hashPassword;

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({
          status: 'fail',
          message: 'You must provide your old password to update your password.',
        });
      } else {
        const user = await User.findById(req.user._id).select('+password');

        if (!(await user.comparePasswords(oldPassword, user.password))) {
          return res.status(400).json({
            status: 'fail',
            message: 'Old password is incorrect',
          });
        }

        hashPassword = await bcrypt.hash(newPassword, 12);
      }
    }
    
    let updatedObj = { name, password: hashPassword };

    if (newMail) {
      const user = await User.findById(req.user._id);
      if (user.email !== newMail) {
        updatedObj.email = newMail;
      } 
    }

    updatedObj = filterObject(updatedObj, ['name', 'email', 'password']);

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updatedObj, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating user data',
    });
  }
});

 const assignPeople = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(500).json({
        status: 'error',
        message: 'User not found',
      });
    }
    const { email } = req.body;

    if (email === user.email) {
      return  res.status(500).json({
        status: 'error',
        message: 'An error occurred while updating user data',
      });
    }

    
    if (user.myAssignies && user.myAssignies === email) {
      return  res.status(500).json({
        status: 'error',
        message: 'Both users mail and assigned mail cannot be same',
      });
    }

    const newUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { myAssignies: email } },
      { new: true }
    );

    const { password, ...details } = newUser._doc;
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating user data',
    });
  }
};

module.exports = {getUser, updateUser, assignPeople}