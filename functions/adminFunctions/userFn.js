const {
  set_render_args,
  redirect_page,
  modefied_message,
  added_message,
  successful_redirect,
  check_add_errors,
  check_edit_errors,
} = require('./commonFn');

const User = require('../../models/userModel');
const { hashPassword } = require('../authFn');

/**
 * @function - Display add user page
 * @param {object} req
 * @param {object} res
 * @param {string} type
 * @param {array} arrayType
 */
function display_add_user_page({ req, res, type, page, arrayType }) {
  const args = set_render_args({ req, type, page, arrayType });
  args.isNormalRegister = true;
  redirect_page({ res, type, args });
}

/**
 * @function - Display edit user page
 * @param {object} req
 * @param {object} res
 * @param {string} type
 * @param {array} arrayType
 */
async function display_edit_user_page({
  req,
  res,
  type,
  item,
  page,
  arrayType,
}) {
  const args = set_render_args({ req, type, page, arrayType });
  args.isEdit = true;
  user = await User.findById(req.params.id);
  args.isNormalRegister = true;
  if (user.googleId || user.facebookId) args.isNormalRegister = false;
  args.item = user.toJSON();
  redirect_page({ res, type, args });
}

// Add User
async function add_user({ req, res, type, fields }) {
  const redirectLink = check_add_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  fields = await modify_user_fields(fields);
  await User.create(fields);
  added_message({ req, type });
  successful_redirect({ req, res, type });
}

// Edit User
async function edit_user({ req, res, type, fields }) {
  const redirectLink = check_edit_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  fields = await modify_user_fields(fields);
  await User.findByIdAndUpdate(req.body.itemId, fields);
  modefied_message({ req, type });
  successful_redirect({ req, res, type });
}

// Modify email and password fields
async function modify_user_fields(fields) {
  if (fields.password === 'stillPass') delete fields.password;
  if (fields.email === 'email@example.ha') delete fields.email;
  if (fields.password) fields.password = await hashPassword(fields.password);
  return fields;
}

module.exports = {
  display_add_user_page,
  display_edit_user_page,
  add_user,
  edit_user,
  modify_user_fields,
};
