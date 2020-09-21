const mongoose = require('mongoose');
const ChatShcema = mongoose.Schema({
  msg: String,
  to: String,
  from: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
});
const Chat = mongoose.model('chat', ChatShcema);
module.exports = Chat;
