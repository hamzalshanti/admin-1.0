const Category = require('../../models/categoryModel');
const CategoryTranslation = require('../../models/categoryTranslationModel');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const {
  display_add_category_page,
  display_edit_category_page,
  add_category,
  edit_category,
  formatEditInputs,
  getFields,
} = require('../../functions/adminFunctions/categoryFn');

const type = 'category';
let page = '';

/**
 * Category controllers of Route: /admin-panel/category
 */

/**
 * Controller of Route/show
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_show_categories = async (req, res) => {
  try {
    const items = await CategoryTranslation.find({
      code: 'en',
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
const get_add_category = async (req, res) => {
  page = 'Add';
  display_add_category_page({ req, res, type, page });
};

/**
 * Controller of Route/edit/:id
 * Method GET
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const get_edit_category = async (req, res) => {
  const item = await formatEditInputs(req.params.id);
  page = 'Edit';
  display_edit_category_page({ req, res, type, item, page });
};

/**
 * Controller of Route/add
 * Method POST
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const post_add_category = async (req, res) => {
  const fields = getFields(req);
  add_category({ req, res, type, fields });
};

/**
 * Controller of Route/edit
 * Method PUT
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const put_edit_category = async (req, res) => {
  const fields = getFields(req);
  await edit_category({ req, res, type, fields });
};

/**
 * Controller of Route/show
 * Method DELETE
 * @function
 * @param {object} req - request object
 * @param {object} res - reponse object
 */
const delete_category = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.body.id);
    await CategoryTranslation.deleteMany({
      category: mongoose.Types.ObjectId(req.body.id),
    });
    res.redirect('/admin-panel/category/show');
  } catch {}
};

module.exports = {
  get_show_categories,
  get_add_category,
  get_edit_category,
  post_add_category,
  put_edit_category,
  delete_category,
};
