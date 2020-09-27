const Product = require('../models/productModel');
const ProductTranslation = require('../models/productTranslationModel');
const CategoryTranslation = require('../models/categoryTranslationModel');
const TagTranslation = require('../models/tagTranslationModel');
const Rate = require('../models/rateModel');
const User = require('../models/userModel');
const Tag = require('../models/tagModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Chat = require('../models/chatModel');
const { isRateBefore, getRateDetails } = require('../functions/rateFn');
const getLatestTextedUsers = require('../functions/getLatestUserTexted');
const mongoose = require('mongoose');
const { AppError, catchAsync } = require('../Error');
const { formatCurrency, formatCurrencyCart } = require('../config/currency');

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
const get_index = catchAsync(async (req, res, next) => {
  let recentProducts = await getRecentProducts(req.cookies._local, 6);
  if (req.cookies._currency != 'USD')
    recentProducts = await formatCurrency(
      req.cookies._currency,
      recentProducts
    );
  res.render('matjri/index', {
    title: 'Home',
    recentProducts: recentProducts.map((product) => product.toJSON()),
  });
});

/**
 * Controller of Route/cart
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_cart = async (req, res) => {
  if (!req.session.cart) return res.render('matjri/cart', { products: null });
  let cart = new Cart(JSON.parse(JSON.stringify(req.session.cart)));
  if (req.cookies._currency != 'USD')
    await formatCurrencyCart(req.cookies._currency, cart);
  res.render('matjri/cart', {
    productsInCart: await cart.getArrayOfItems(req.cookies._local),
    totalPrice: cart.totalPrice,
    coupon: cart.coupon,
  });
};

/**
 * Controller of Route/shop
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_shop = catchAsync(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  let products = await ProductTranslation.find({
    code: req.cookies._local || 'en',
  })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('product');
  if (req.cookies._currency != 'USD')
    products = await formatCurrency(req.cookies._currency, products);

  const count = await Product.countDocuments();
  let totalPages = Math.ceil(count / limit),
    currentPage = page;
  res.render('matjri/shop', {
    title: 'shop',
    products: products.map((product) => product.toJSON()),
    totalPages,
    page,
  });
});

/**
 * Controller of Route/single-product
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - response object
 */
const get_single_product = catchAsync(async (req, res, next) => {
  let product = await ProductTranslation.findOne({
    code: req.cookies._local || 'en',
    product: mongoose.Types.ObjectId(req.params.id),
  }).populate('product');

  if (!product) return next(new AppError('No tour found with that ID', 404));

  product = await formatCurrency(req.cookies._currency, product);

  const category = await CategoryTranslation.findOne({
    code: req.cookies._local || 'en',
    category: product['product'].category,
  }).select({
    name: 1,
    category: 1,
  });
  const tags = await TagTranslation.find({
    code: req.cookies._local || 'en',
    tag: {
      $in: product['product'].tags,
    },
  }).select({
    name: 1,
  });
  const vendor = await User.findById(product['product'].createdBy).select({
    fullName: 1,
  });
  let relatedProducts = await ProductTranslation.find({
    code: req.cookies._local || 'en',
  })
    .nor({
      product: product['product']._id,
    })
    .populate('product')
    .limit(6);

  relatedProducts = await formatCurrency(
    req.cookies._currency,
    relatedProducts
  );

  let recentProducts = await getRecentProducts(req.cookies._local, 4);
  recentProducts = await formatCurrency(req.cookies._currency, recentProducts);

  /** Get Reviews Details */
  const rates = await Rate.find({ productId: req.params.id });

  /** Get Rate Details */
  const RateDetails = await getRateDetails(req);

  //** Check allowness to review */
  let isOpenReview = await isRateBefore(req);
  res.render('matjri/single-product', {
    title: 'Product',
    product: product.toJSON(),
    category: category.toJSON(),
    tags: tags.map((tag) => tag.toJSON()),
    relatedProducts: relatedProducts.map((product) => product.toJSON()),
    recentProducts: recentProducts.map((product) => product.toJSON()),
    RateDetails,
    isOpenReview,
    vendor: vendor.toJSON(),
  });
});

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
    const product = await Product.findById(productId).select({
      price: 1,
      discount: 1,
      mainImage: 1,
    });
    cart.add(product, product._id);
    req.session.cart = cart;
    res.status(201).json('Add Done');
  } catch (error) {
    console.log(error);
  }
};

const add_coupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.body.code });
    if (!coupon) {
      let cart1 = new Cart(req.session.cart);
      cart1.coupon = '0';
      req.session.cart = cart1;
      return res.status(402).json({
        msg: 'coupon not Exist',
      });
    }
    let cart = new Cart(req.session.cart);
    cart.coupon = coupon;
    req.session.cart = cart;
    res.status(200).send(coupon);
  } catch (error) {}
};

const update_cart = async (req, res) => {
  const cart = new Cart(req.session.cart);
  await Promise.all(
    req.body.map(async (element) => {
      const product = await Product.findById(element.id).select({
        price: 1,
        discount: 1,
      });
      if (product) {
        const qty = element.qty;
        cart.update(product, product._id, qty);
      }
    })
  );
  req.session.cart = cart;
  res.status(200).json('sad');
};

const delete_cart_item = (req, res) => {
  const cart = new Cart(req.session.cart);
  cart.deleteItem(req.params.id);
  req.session.cart = cart;
  res.redirect('/cart');
};

const chat_page = async (req, res) => {
  try {
    res.render('chat');
  } catch (error) {
    console.log(error);
  }
};

const get_messages = async (req, res) => {
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
  const image = await User.findById(req.body.id).select({
    image: 1,
    _id: 0,
  });
  if (conversition.length === 0) return res.json('No Messges yet');
  res.json({
    conversition: conversition.map((c) => c.toJSON()),
    image: image['image'],
  });
};

const get_vendor = async (req, res) => {
  const vendor = await User.findOne({
    _id: req.params.id,
  });
  res.render('matjri/vendor', {
    vendor: vendor.toJSON(),
  });
};

/** Get recent products */
async function getRecentProducts(_local = 'en', limit) {
  const products = await ProductTranslation.find({
    code: _local,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('product');
  return products;
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
  add_coupon,
  update_cart,
  delete_cart_item,
  chat_page,
  get_messages,
  get_vendor,
};
