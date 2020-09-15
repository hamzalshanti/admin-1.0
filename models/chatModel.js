const mongoose = require('mongoose');
const ChatShcema = mongoose.Schema({
  msg: String,
  sender: mongoose.Schema.Types.ObjectId,
  reciever: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Chat = mongoose.model('chat', ChatShcema);
module.exports = Chat;
