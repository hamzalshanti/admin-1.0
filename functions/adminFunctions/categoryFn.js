const {
  set_render_args,
  redirect_page,
  modefied_message,
  added_message,
  successful_redirect,
  check_add_errors,
  check_edit_errors,
} = require('./commonFn');

const Category = require('../../models/categoryModel');
const CategoryTranslation = require('../../models/categoryTranslationModel');
const codes = ['en', 'ar'];
const mongoose = require('mongoose');

/*********** Category Functions ****************/

// Display Add Category Page
function display_add_category_page({ req, res, type, page }) {
  const args = set_render_args({ req, type, page });
  redirect_page({ res, type, args });
}

// Display Edit Category Page
async function display_edit_category_page({ req, res, type, item, page }) {
  const args = set_render_args({ req, type, page });
  args.isEdit = true;
  args.item = item;
  redirect_page({ res, type, args });
}

// Add Category
async function add_category({ req, res, type, fields }) {
  const redirectLink = check_add_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  const category = await Category.create({});
  await addTranslationCategory(fields, category._id);
  added_message({ req, type });
  successful_redirect({ req, res, type });
}

// Edit Category
async function edit_category({ req, res, type, fields }) {
  const redirectLink = check_edit_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  const categories = await CategoryTranslation.find({
    category: mongoose.Types.ObjectId(req.body.itemId),
  });
  manageEdit(fields, categories);
  modefied_message({ req, type });
  successful_redirect({ req, res, type });
}

async function addTranslationCategory(fields, id) {
  const translations = [];
  codes.forEach((code) => {
    translations.push({
      name: fields[`name_${code}`],
      description: fields[`description_${code}`],
      code: code,
      category: id,
    });
  });
  await CategoryTranslation.create(translations);
}

async function formatEditInputs(id) {
  const categoryTranslations = await CategoryTranslation.find({
    category: id,
  });
  const inputsNames = {};
  categoryTranslations.forEach((c) => {
    inputsNames[`name_${c.code}`] = c.name;
    inputsNames[`description_${c.code}`] = c.description;
  });
  inputsNames.id = id;
  return inputsNames;
}

function getFields(req) {
  const fields = {};
  codes.forEach((c) => {
    fields[`name_${c}`] = req.body[`name_${c}`];
    fields[`description_${c}`] = req.body[`description_${c}`];
  });
  return fields;
}

function manageEdit(fields, categories) {
  categories.forEach(async (c) => {
    await CategoryTranslation.findByIdAndUpdate(c._id, {
      name: fields[`name_${c.code}`],
      description: fields[`description_${c.code}`],
    });
  });
}

module.exports = {
  display_add_category_page,
  display_edit_category_page,
  add_category,
  edit_category,
  formatEditInputs,
  getFields,
};
