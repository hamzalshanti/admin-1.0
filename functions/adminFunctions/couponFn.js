const {
  set_render_args,
  redirect_page,
  modefied_message,
  added_message,
  successful_redirect,
  check_add_errors,
  check_edit_errors,
} = require('./commonFn');

const Coupon = require('../../models/couponModel');

/*********** Category Functions ****************/

// Display Add Category Page
function display_add_coupon_page({ req, res, type, page }) {
  const args = set_render_args({ req, type, page });
  redirect_page({ res, type, args });
}

// Display Edit Category Page
async function display_edit_coupon_page({ req, res, type, item, page }) {
  const args = set_render_args({ req, type, page });
  args.isEdit = true;
  args.item = item.toJSON();
  redirect_page({ res, type, args });
}

// Add Category
async function add_coupon({ req, res, type, fields }) {
  const redirectLink = check_add_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  await Coupon.create(fields);
  added_message({ req, type });
  successful_redirect({ req, res, type });
}

// Edit Category
async function edit_coupon({ req, res, type, fields }) {
  const redirectLink = check_edit_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  if (fields.code === 'sameCoupon') delete fields.code;
  await Coupon.findByIdAndUpdate(req.body.itemId, fields);
  modefied_message({ req, type });
  successful_redirect({ req, res, type });
}

module.exports = {
  display_add_coupon_page,
  display_edit_coupon_page,
  add_coupon,
  edit_coupon,
};
