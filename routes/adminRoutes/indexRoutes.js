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
router.get('/chat/:id', async (req, res) => {
  try {
    let chats = await Chat.find({
      $and: [
        {
          $or: [
            { sender: mongoose.Types.ObjectId(req.user._id) },
            { reciever: mongoose.Types.ObjectId(req.user._id) },
          ],
        },
        {
          $or: [
            { sender: mongoose.Types.ObjectId(req.params.id) },
            { reciever: mongoose.Types.ObjectId(req.params.id) },
          ],
        },
      ],
    });
    chats = formatMsgs(req, chats);
    res.render('dashboard/chat', {
      sender: req.user._id,
      reciever: req.params.id,
      chats: chats,
      layout: 'admin',
    });
  } catch (error) {
    console.log(error);
  }
});

function formatMsgs(req, chats) {
  chats = chats.map((msg) => msg.toJSON());
  chats.forEach((chat) => {
    if (chat.sender.toString() === req.user._id.toString())
      chat.outgoing = true;
  });
  return chats;
}

module.exports = router;
