const { body } = require('express-validator');
const User = require('./models/userModel');
const Coupon = require('./models/couponModel');

const singupValidation = [
  body('fullName').trim().notEmpty().withMessage('full Name required'),
  body('email')
    .isEmail()
    .withMessage('invalid email')
    .custom(async (value, { req }) => {
      user = await User.findOne({ email: value });
      if (user) throw 'email already exist';
      return true;
    }),
  body('password').isLength({ min: 3 }).withMessage('password must at least 3'),
  body('confirmPassword').custom((value, { req }) => {
    if (value === req.body.password) return true;
    throw 'passwords not match';
  }),
];

const productValidation = [
  body('name_en').trim().notEmpty().withMessage('name can not be empty'),
  body('name_ar').trim().notEmpty().withMessage('name can not be empty'),
  body('price').trim().isNumeric().withMessage('Must Number'),
  body('qty').trim().isNumeric().withMessage('Qty must be number'),
  body('description_en')
    .trim()
    .notEmpty()
    .withMessage('Description can not be empty'),
  body('description_ar')
    .trim()
    .notEmpty()
    .withMessage('Description can not be empty'),
  body('category').trim().notEmpty().withMessage('please select category'),
  body('discount')
    .isNumeric()
    .custom((value) => {
      if (value >= 1 && value <= 99) return true;
      throw 'only numbers between 1 and 99';
    }),
];

const categoryValidation = [
  body('name_en')
    .trim()
    .notEmpty()
    .withMessage('category name cannot be empty'),
  body('description_en')
    .trim()
    .notEmpty()
    .withMessage('category description cannot be empty'),
  body('name_ar')
    .trim()
    .notEmpty()
    .withMessage('category name cannot be empty'),
  body('description_ar')
    .trim()
    .notEmpty()
    .withMessage('category description cannot be empty'),
];

const tagValidation = [
  body('name_en').trim().notEmpty().withMessage('tag name cannot be empty'),
  body('name_ar').trim().notEmpty().withMessage('tag name cannot be empty'),
];

const couponValidation = [
  body('code')
    .trim()
    .notEmpty()
    .withMessage('code cannot be empty')
    .custom(async (value, { req }) => {
      coupon = await Coupon.findOne({ code: value });
      if (coupon) throw 'code already exist';
      return true;
    }),
  body('discountRate')
    .trim()
    .notEmpty()
    .withMessage('discount cannot be empty'),
];

module.exports = {
  singupValidation,
  productValidation,
  categoryValidation,
  couponValidation,
  tagValidation,
};
