const { Router } = require('express');
const router = Router();
const {
  get_index,
  get_cart,
  get_shop,
  get_single_product,
  get_checkout,
  get_order,
  post_rate,
  add_to_cart,
  add_coupon,
  update_cart,
  delete_cart_item,
  chat_page,
} = require('../controllers/indexController');
const { siteGuard } = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
// @GET     @desc: show index page
router.get('/', siteGuard, get_index);
router.get('/cart', siteGuard, get_cart);
router.get('/shop', siteGuard, get_shop);
router.get('/single-product/:id', siteGuard, get_single_product);
router.get('/checkout', siteGuard, get_checkout);
router.get('/order', siteGuard, get_order);
router.post('/rate/:id', siteGuard, post_rate);
router.post('/add-to-cart/:id', add_to_cart);
router.post('/cart/coupon', add_coupon);
router.post('/cart/update', update_cart);
router.get('/cart/delete/:id', delete_cart_item);
router.get('/chat', siteGuard, chat_page);
router.get('/chat/:id', siteGuard, chat_page);

router.use('/get-messages', async (req, res) => {
  const conversition = await Chat.find({
    $and: [
      {
        $or: [
          { from: req.user._id.toString() },
          { to: req.user._id.toString() },
        ],
      },
      {
        $or: [{ from: req.body.id }, { to: req.body.id }],
      },
    ],
  })
    .sort({
      createdAt: -1,
    })
    .skip(req.body.skip)
    .limit(10);
  conversition.forEach(async (conv) => {
    if (req.user._id.toString() === conv.to && conv.read === false) {
      conv.read = true;
      await conv.save();
    }
  });
  // console.log(conversition);
  if (conversition.length === 0) return res.json('No Messges yet');
  res.json(conversition.map((c) => c.toJSON()));
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
