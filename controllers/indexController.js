const Product = require('../models/productModel');
const Rate = require('../models/rateModel');
const Tag = require('../models/tagModel');
const Cart = require('../models/cartModel');
const { isRateBefore, getRateDetails } = require('../functions/rateFn');

/**
 * Index controllers of Route: /
 */

/**
 * Controller of Route
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_index = async (req, res) => {
  const recentProducts = await getRecentProducts(6);
  res.render('matjri/index', {
    title: 'Home',
    recentProducts: recentProducts.map((product) => product.toJSON()),
  });
};

/**
 * Controller of Route/cart
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_cart = (req, res) => {
  if (!req.session.cart) return res.render('matjri/cart', { products: null });
  var cart = new Cart(req.session.cart);
  res.render('matjri/cart', {
    products: cart.getArrayOfItems(),
    totalPrice: cart.totalPrice,
  });
};

/**
 * Controller of Route/shop
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_shop = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const products = await Product.find({})
    .limit(limit * 1)
    .skip((page - 1) * limit);
  const count = await Product.countDocuments();
  let totalPages = Math.ceil(count / limit),
    currentPage = page;
  console.log(totalPages, count);
  res.render('matjri/shop', {
    title: 'shop',
    products: products.map((product) => product.toJSON()),
    totalPages,
    page,
  });
};

/**
 * Controller of Route/single-product
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_single_product = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('category', 'categoryName')
    .populate('tags', 'name');

  /**  Get Related Products Accordinn To Category*/
  const relatedProducts = await Product.find({
    category: product.category._id,
  })
    .nor({ _id: product._id })
    .limit(6);

  /**  Get Recent Products*/
  const recentProducts = await getRecentProducts(4);

  /** Get Reviews Details */
  const rates = await Rate.find({ productId: req.params.id });

  /** Get Rate Details */
  const RateDetails = await getRateDetails(req);

  //** Check allowness to review */
  let isOpenReview = await isRateBefore(req);

  res.render('matjri/single-product', {
    title: 'Product',
    product: product.toJSON(),
    relatedProducts: relatedProducts.map((product) => product.toJSON()),
    recentProducts: recentProducts.map((product) => product.toJSON()),
    RateDetails,
    isOpenReview,
  });
};

/**
 * Controller of Route/checkout
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_checkout = (req, res) => {
  res.render('matjri/checkout', {
    title: 'checkout',
  });
};

/**
 * Controller of Route/order
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_order = (req, res) => {
  res.render('matjri/order', {
    title: 'Order',
  });
};

const post_rate = async (req, res) => {
  try {
    let isOpenReview = await isRateBefore(req);
    if (!isOpenReview)
      return res.status(406).json({ msg: 'You review this product before' });
    const rate = await Rate.create({
      userId: req.user._id,
      productId: req.params.id,
      rate: req.body.rate,
      review: req.body.review,
    });
    const product = await Product.findById(req.params.id);
    product.rateCount += 1;
    product.rateValue += req.body.rate;
    product.rateAverage = (product.rateValue / product.rateCount).toFixed(1);
    await product.save();
    res.status(201).json({ msg: 'Thanks for your review' });
  } catch (error) {
    console.log(error);
  }
};

const add_to_cart = async (req, res) => {
  try {
    let qtyStep = req.body.qty ? req.body.qty : 1;
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {}, qtyStep);
    const product = await Product.findById(productId);
    cart.add(product, product._id);
    req.session.cart = cart;
    res.status(201).json('Add Done');
  } catch (error) {}
};

/** Get recent products */
async function getRecentProducts(limit) {
  const product = await Product.find({}).sort({ createdAt: -1 }).limit(limit);
  return product;
}

module.exports = {
  get_index,
  get_cart,
  get_shop,
  get_single_product,
  get_checkout,
  get_order,
  post_rate,
  add_to_cart,
};
