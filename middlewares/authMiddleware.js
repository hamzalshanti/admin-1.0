const siteGuard = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user._id.toString() === req.cookies._user) return next();
    res.clearCookie('_user');
    req.logout();
    return res.redirect('/');
  }
  return res.redirect('/auth/login');
};
const registerGuard = (req, res, next) => {
  if (!req.isAuthenticated()) return next();
  if (req.user.position === 'admin') return res.redirect('/admin-panel');
  return res.redirect('/');
};

const adminGuard = (req, res, next) => {
  if (req.isAuthenticated() && req.user.position === 'admin') return next();
  return res.redirect('/admin-panel/login');
};

module.exports = {
  siteGuard,
  registerGuard,
  adminGuard,
};
