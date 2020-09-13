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
} = require('../controllers/indexController');
const { siteGuard } = require('../middlewares/authMiddleware');

// @GET     @desc: show index page
router.get('/', siteGuard, get_index);
router.get('/cart', siteGuard, get_cart);
router.get('/shop', siteGuard, get_shop);
router.get('/single-product/:id', siteGuard, get_single_product);
router.get('/checkout', siteGuard, get_checkout);
router.get('/order', siteGuard, get_order);
router.post('/rate/:id', siteGuard, post_rate);
router.post('/add-to-cart/:id', add_to_cart);

module.exports = router;
