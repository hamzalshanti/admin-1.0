const Category = require('../../models/categoryModel');
const Product = require('../../models/productModel');
const mongoose = require('mongoose');
const { getErrorsObject } = require('../../functions/authFn');
const { validationResult } = require('express-validator');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const {
  display_add_product_page,
  display_edit_product_page,
  add_product,
  edit_product,
  formatEditInputs,
  getFields,
} = require('../../functions/adminFunctions/productFn');
const ProductTranslation = require('../../models/productTranslationModel');
const CategoryTranslation = require('../../models/categoryTranslationModel');
const TagTranslation = require('../../models/tagTranslationModel');

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
    const items = await ProductTranslation.find({
      code: 'en',
    })
      .populate('product')
      .select({
        _id: 0,
        __v: 0,
        code: 0,
        description: 0,
      });
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
  const arrayType = await CategoryTranslation.find({
    code: 'en',
  });
  const tags = await TagTranslation.find({
    code: 'en',
  });
  page = 'Add';
  display_add_product_page({ req, res, type, page, arrayType, tags });
};

/**
 * Controller of Route/get/:id
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_edit_product = async (req, res) => {
  const arrayType = await CategoryTranslation.find({
    code: 'en',
  }).select({
    name: 1,
    category: 1,
  });
  const tags = await TagTranslation.find({
    code: 'en',
  });
  const item = {
    ...(await Product.findById(req.params.id)).toJSON(),
    ...(await formatEditInputs(req.params.id)),
  };
  page = 'Edit';
  display_edit_product_page({ req, res, type, item, page, arrayType, tags });
};

/**
 * Controller of Route/add
 * Method POST
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const post_add_product = async (req, res) => {
  const fields = getFields(req);
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
  const fields = getFields(req);
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
    await ProductTranslation.deleteMany({
      product: mongoose.Types.ObjectId(req.body.id),
    });
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
