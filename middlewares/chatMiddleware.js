const adminChatGuard = (req, res, next) => {
  if (req.user.position !== 'admin') return res.redirect('/chat');
  next();
};

const buyerChatGuard = (req, res, next) => {
  if (req.user.position !== 'buyer') return res.redirect('/admin-panel/chat');
  next();
};

module.exports = {
  adminChatGuard,
  buyerChatGuard,
};
