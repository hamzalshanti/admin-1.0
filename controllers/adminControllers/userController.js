const User = require('../../models/userModel');
const { getErrorsObject, hashPassword } = require('../../functions/authFn');
const { validationResult } = require('express-validator');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const {
  display_add_user_page,
  display_edit_user_page,
  add_user,
  edit_user,
} = require('../../functions/adminFunctions/userFn');
const type = 'user';
const arrayType = [{ position: 'buyer' }, { position: 'admin' }];
let page = '';
/**
 * User controllers of Route: /admin-panel/user
 */

/**
 * Controller of Route/show
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_show_users = async (req, res) => {
  try {
    const items = await User.find();
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
const get_add_user = async (req, res) => {
  display_add_user_page({ req, res, type, arrayType });
};

/**
 * Controller of Route/edit/:id
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_edit_user = async (req, res) => {
  const item = await User.findById(req.params.id);
  let page = 'Edit';
  display_edit_user_page({ req, res, type, item, page, arrayType });
};

/**
 * Controller of Route/add
 * Method POST
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const post_add_user = async (req, res) => {
  const fields = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    position: req.body.position,
  };
  add_user({ req, res, type, fields });
};

/**
 * Controller of Route/edit
 * Method PUT
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const put_edit_user = async (req, res) => {
  const fields = {
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    position: req.body.position,
  };
  edit_user({ req, res, type, fields });
};

/**
 * Controller of Route/delete
 * Method DELETE
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const delete_user = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body.id);
    res.redirect('/admin-panel/user/show');
  } catch {}
};

module.exports = {
  get_show_users,
  get_add_user,
  get_edit_user,
  post_add_user,
  put_edit_user,
  delete_user,
};
