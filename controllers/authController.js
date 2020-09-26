const User = require('../models/userModel');

const { validationResult } = require('express-validator');

const { getErrorsObject, hashPassword } = require('../functions/authFn');

/**
 * Auth controllers of Route: /auth
 */

/**
 * Controller of Route/login
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_login = (req, res) => {
  res.render('matjri/login', {
    layout: false,
    title: 'Login',
    success: req.flash('success'),
    error: req.flash('error')[0],
  });
};

/**
 * Controller of Route/signup
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_signup = (req, res) => {
  res.render('matjri/signup', {
    layout: false,
    title: 'Singup',
  });
};

/**
 * Controller of Route/signup
 * Method POST
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const post_signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    let { errors } = validationResult(req);
    if (errors.length > 0)
      return res.render('matjri/signup', {
        layout: false,
        title: 'Singup',
        fullName,
        email,
        errorObject: getErrorsObject(errors),
      });
    const user = await User.create({
      fullName,
      email,
      password: await hashPassword(password),
    });
    req.flash('success', 'created done you can login now');
    res.redirect('/auth/login');
  } catch (error) {
    console.log(error);
  }
};

/**
 * Controller of Route/logout
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_logout = (req, res) => {
  res.cookie('_user', { expires: Date.now() });
  req.logout();
  res.redirect('/');
};

module.exports = {
  get_login,
  get_signup,
  post_signup,
  get_logout,
};
