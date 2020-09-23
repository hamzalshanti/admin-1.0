const mongoose = require('mongoose');
const tagSchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Tag = mongoose.model('tag', tagSchema);
module.exports = Tag;
