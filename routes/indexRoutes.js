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
  get_messages,
  get_vendor,
} = require('../controllers/indexController');

const { siteGuard } = require('../middlewares/authMiddleware');
const { buyerChatGuard } = require('../middlewares/chatMiddleware');
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
router.get('/chat', siteGuard, buyerChatGuard, chat_page);
router.get('/chat/:id', siteGuard, buyerChatGuard, chat_page);
router.post('/get-messages', get_messages);
router.get('/vendor/:id', get_vendor);
router.get('/chat/not-found/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user.toJSON());
});
module.exports = router;
