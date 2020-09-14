const Coupon = require('../../models/couponModel');
const { getErrorsObject } = require('../../functions/authFn');
const { validationResult } = require('express-validator');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const {
  display_add_coupon_page,
  display_edit_coupon_page,
  add_coupon,
  edit_coupon,
} = require('../../functions/adminFunctions/couponFn');

const type = 'coupon';
let page = '';

/**
 * Coupon controllers of Route: /admin-panel/coupon
 */

/**
 * Controller of Route/show
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_show_coupons = async (req, res) => {
  try {
    const items = await Coupon.find();
    show_items({ req, res, type, items });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Controller of Route/add
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_add_coupon = async (req, res) => {
  page = 'Add';
  display_add_coupon_page({ req, res, type, page });
};

/**
 * Controller of Route/edit/:id
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_edit_coupon = async (req, res) => {
  const item = await Coupon.findById(req.params.id);
  page = 'Edit';
  display_edit_coupon_page({ req, res, type, item, page });
};

/**
 * Controller of Route/add
 * Method POST
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const post_add_coupon = async (req, res) => {
  const fields = {
    code: req.body.code,
    discountRate: +req.body.discountRate,
  };
  add_coupon({ req, res, type, fields });
};

/**
 * Controller of Route/edit
 * Method PUT
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const put_edit_coupon = async (req, res) => {
  const fields = {
    code: req.body.code,
    discountRate: +req.body.discountRate,
  };
  await edit_coupon({ req, res, type, fields });
};

/**
 * Controller of Route/show
 * Method DELETE
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const delete_coupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.body.id);
    res.redirect('/admin-panel/Coupon/show');
  } catch {}
};

module.exports = {
  get_show_coupons,
  get_add_coupon,
  get_edit_coupon,
  post_add_coupon,
  put_edit_coupon,
  delete_coupon,
};
