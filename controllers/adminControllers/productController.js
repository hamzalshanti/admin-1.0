const Category = require('../../models/categoryModel');
const Product = require('../../models/productModel');
const { getErrorsObject } = require('../../functions/authFn');
const { validationResult } = require('express-validator');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const {
  display_add_product_page,
  display_edit_product_page,
  add_product,
  edit_product,
} = require('../../functions/adminFunctions/productFn');

const type = 'product';
let page = '';

/**
 * Product controllers of Route: /admin-panel/product
 */

/**
 * Controller of Route/show
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_show_products = async (req, res) => {
  try {
    const items = await Product.find();
    show_items({ req, res, type, items });
  } catch (error) {
    console.log(error);
  }
};

/**
 * Controller of Route/add
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_add_product = async (req, res) => {
  const arrayType = await Category.find();
  page = 'Add';
  display_add_product_page({ req, res, type, page, arrayType });
};

/**
 * Controller of Route/get/:id
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_edit_product = async (req, res) => {
  const arrayType = await Category.find();
  const item = await Product.findById(req.params.id);
  page = 'Edit';
  display_edit_product_page({ req, res, type, item, page, arrayType });
};

/**
 * Controller of Route/add
 * Method POST
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const post_add_product = async (req, res) => {
  const fields = {
    productName: req.body.productName,
    productPrice: req.body.productPrice,
    productQty: req.body.productQty,
    productDescription: req.body.productDescription,
    category: req.body.category,
    discount: req.body.discount,
  };
  add_product({ req, res, type, fields });
};

/**
 * Controller of Route/edit
 * Method PUT
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const put_edit_product = async (req, res) => {
  const fields = {
    productName: req.body.productName,
    productPrice: req.body.productPrice,
    productQty: req.body.productQty,
    productDescription: req.body.productDescription,
    category: req.body.category,
    discount: req.body.discount,
    tags: req.body.tags,
  };
  await edit_product({ req, res, type, fields });
};

/**
 * Controller of Route/show
 * Method DELETE
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const delete_product = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.body.id);
    res.redirect('/admin-panel/product/show');
  } catch {}
};

module.exports = {
  get_show_products,
  get_add_product,
  get_edit_product,
  post_add_product,
  put_edit_product,
  delete_product,
};
