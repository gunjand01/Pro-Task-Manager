const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  myAssignies: {
    type: [String], // Define as an array of strings
    default: [],
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
});

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.methods.comparePasswords = async function (
  userProvided,
  hashStored
) {
  return await bcrypt.compare(userProvided, hashStored);
};

const User = mongoose.model('User', userSchema);

module.exports = User;