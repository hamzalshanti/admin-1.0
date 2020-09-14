const { Router } = require('express');
const router = Router();
const Coupon = require('../../models/couponModel');
const {
  get_add_coupon,
  post_add_coupon,
  get_show_coupons,
  get_edit_coupon,
  put_edit_coupon,
  delete_coupon,
} = require('../../controllers/adminControllers/couponController');

const { couponValidation } = require('../../validation');

router.get('/show', get_show_coupons);
router.get('/add', get_add_coupon);
router.post('/add', couponValidation, post_add_coupon);
router.get('/edit/:id', get_edit_coupon);
router.put(
  '/edit',
  async (req, res, next) => {
    if (req.body.itemId) {
      const coupon2 = await Coupon.findOne({ code: req.body.code });
      if (coupon2)
        if (coupon2._id == req.body.itemId) {
          req.body.code = 'sameCoupon';
        }
    }
    next();
  },
  couponValidation,
  put_edit_coupon
);
router.delete('/show', delete_coupon);

module.exports = router;
