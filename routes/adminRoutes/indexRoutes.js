const { Router } = require('express');
const router = Router({ mergeParams: true });
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const userRoutes = require('./userRoutes');
const tagRoutes = require('./tagRoutes');
const couponRoutes = require('./couponRoutes');
const passport = require('passport');
const mongoose = require('mongoose');
const {
  show_dashboard,
  admin_login,
  chat_page,
} = require('../../controllers/adminControllers/indexController');
const {
  adminGuard,
  registerGuard,
} = require('../../middlewares/authMiddleware');

const Chat = require('../../models/chatModel');

// Login
router.get('/login', registerGuard, admin_login);
router.post(
  '/login',
  registerGuard,
  passport.authenticate('admin-login', {
    successRedirect: '/admin-panel',
    failureRedirect: '/admin-panel/login',
    failureFlash: true,
  })
);

router.use(adminGuard);

router.get('/', show_dashboard);

router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/user', userRoutes);
router.use('/tag', tagRoutes);
router.use('/coupon', couponRoutes);
router.get('/chat', chat_page);
router.get('/chat/:id', chat_page);

module.exports = router;
