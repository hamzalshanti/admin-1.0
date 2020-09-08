const Product = require('../models/productModel');

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
const get_index = (req, res) => {
  res.render('matjri/index', {
    title: 'Home',
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
  res.render('matjri/cart', {
    title: 'Cart',
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
  const products = await Product.find({});
  res.render('matjri/shop', {
    title: 'shop',
    products: products.map((product) => product.toJSON()),
  });
};

/**
 * Controller of Route/single-product
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_single_product = (req, res) => {
  res.render('matjri/single-product', {
    title: 'Product',
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

module.exports = {
  get_index,
  get_cart,
  get_shop,
  get_single_product,
  get_checkout,
  get_order,
};
