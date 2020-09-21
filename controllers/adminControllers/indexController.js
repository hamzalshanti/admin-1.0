/**
 * Index controllers of Route: /admin-panel
 */

/**
 * Controller of Route
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const show_dashboard = (req, res) => {
  res.render('dashboard/index', { layout: 'admin' });
};

/**
 * Controller of Route/login
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const admin_login = (req, res) => {
  res.render('dashboard/login', {
    layout: false,
    error: req.flash('error')[0],
  });
};

const chat_page = (req, res) => {
  res.render('chat', {
    layout: 'admin',
  });
};

module.exports = {
  show_dashboard,
  admin_login,
  chat_page,
};
