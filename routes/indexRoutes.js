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
} = require('../controllers/indexController');
const { siteGuard } = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Chat = require('../models/chatModel');
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
