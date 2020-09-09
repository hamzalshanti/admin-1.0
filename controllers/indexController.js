const Product = require('../models/productModel');
const Tag = require('../models/tagModel');

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
  const relatedProducts = await Product.find({
    category: product.category._id,
  })
    .nor({ _id: product._id })
    .limit(6);
  const recentProducts = await getRecentProducts(4);
  res.render('matjri/single-product', {
    title: 'Product',
    product: product.toJSON(),
    relatedProducts: relatedProducts.map((product) => product.toJSON()),
    recentProducts: recentProducts.map((product) => product.toJSON()),
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

// Function get recent product

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
};
