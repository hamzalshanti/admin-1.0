const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  image: {
    type: String,
    default:
      'https://cdn.iconscout.com/icon/free/png-256/avatar-370-456322.png',
  },
  position: {
    type: String,
    default: 'buyer',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('user', userSchema);
module.exports = User;
