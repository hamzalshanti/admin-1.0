const mongoose = require('mongoose');
const rateSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
  },
  rate: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
  },
});
const Rate = mongoose.model('rate', rateSchema);
module.exports = Rate;
