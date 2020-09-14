const mongoose = require('mongoose');
const couponSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  discountRate: {
    type: Number,
    required: true,
  },
});
const Coupon = mongoose.model('coupon', couponSchema);
module.exports = Coupon;
