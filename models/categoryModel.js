const mongoose = require('mongoose');
const categorySchema = mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Category = mongoose.model('category', categorySchema);
module.exports = Category;
