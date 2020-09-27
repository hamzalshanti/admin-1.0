const {
  set_render_args,
  redirect_page,
  modefied_message,
  added_message,
  successful_redirect,
  check_add_errors,
  check_edit_errors,
} = require('./commonFn');
const codes = ['en', 'ar'];
const Tag = require('../../models/tagModel');
const { cloudinary } = require('../../config/cloudinary');
const datauri = require('datauri');
const DatauriParser = require('datauri/parser');
const path = require('path');
const Product = require('../../models/productModel');
const ProductTranslation = require('../../models/productTranslationModel');
const mongoose = require('mongoose');

/**
 * Product functions that used in product controller
 */

/**
 *
 * @param {object} req - request object
 * @param {object} res - reponse object
 * @param {string} type - type of item (herein product)
 * @param {array} arrayType
 */
function display_add_product_page({ req, res, type, page, arrayType, tags }) {
  const args = set_render_args({ req, type, page, arrayType, tags });
  redirect_page({ res, type, args });
}

// Display Edit Product Page
async function display_edit_product_page({
  req,
  res,
  type,
  item,
  page,
  arrayType,
  tags,
}) {
  const args = set_render_args({ req, type, page, arrayType, tags });
  args.isEdit = true;
  // let tags = await getTags(item.tags);
  // args.tags = separateTags(tags).replace(/(^,)|(,$)/g, '');
  args.item = item;
  redirect_page({ res, type, args });
}

// Add Product
async function add_product({ req, res, type, fields }) {
  const redirectLink = check_add_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  fields = await modify_product_fields({ req, fields });
  const product = await Product.create(fields);
  await addTranslationProduct(fields, product._id);
  added_message({ req, type });
  successful_redirect({ req, res, type });
}

// Edit Product
async function edit_product({ req, res, type, fields }) {
  const redirectLink = check_edit_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  fields = await modify_product_fields({ req, fields });
  await Product.findByIdAndUpdate(req.body.itemId, fields);
  const products = await ProductTranslation.find({
    product: mongoose.Types.ObjectId(req.body.itemId),
  });
  manageEdit(fields, products);
  modefied_message({ req, type });
  successful_redirect({ req, res, type });
}

// Modify productTags and uploaded files
async function modify_product_fields({ req, fields }) {
  const parser = new DatauriParser();
  if (req.files['productGallary'])
    if (req.files['productGallary'].length > 0)
      fields.productGallary = await Promise.all(
        req.files['productGallary'].map(async (file) => {
          const content = parser.format(
            path.extname(file.originalname),
            file.buffer
          ).content;
          const result = await cloudinary.uploader.upload(content);
          return result.secure_url;
        })
      );

  if (req.files['mainImage'])
    if (req.files['mainImage'].length > 0) {
      const content = parser.format(
        path.extname(req.files['mainImage'][0].originalname),
        req.files['mainImage'][0].buffer
      ).content;
      const result = await cloudinary.uploader.upload(content);
      fields.mainImage = result.secure_url;
    }
  // fields.tags = await formatTags(req.body.tags);
  return fields;
}

/*
async function formatTags(tags) {
  tags = tags.split(',');
  const arr = await Promise.all(
    tags.map(async (tag) => {
      const doc = await Tag.findOne({ name: tag });
      if (doc) return doc._id;
      const newDoc = await Tag.create({ name: tag });
      return newDoc._id;
    })
  );
  return arr;
}

// Tags
async function getTags(tags) {
  let stringTags = await Promise.all(
    tags.map(async (tag) => {
      const doc = await Tag.findById(tag, { name: 1 });
      return doc.name;
    })
  );
  return stringTags;
}

function separateTags(tags) {
  let separateTags = tags.reduce((total, tag) => {
    return total + tag + ',';
  }, '');
  return separateTags;
}
*/
async function addTranslationProduct(fields, id) {
  const translations = [];
  codes.forEach((code) => {
    translations.push({
      name: fields[`name_${code}`],
      description: fields[`description_${code}`],
      code: code,
      product: id,
    });
  });
  await ProductTranslation.create(translations);
}

function getFields(req) {
  const fields = {};
  fields.price = req.body.price;
  fields.qty = req.body.qty;
  fields.category = req.body.category;
  fields.discount = req.body.discount;
  fields.tags = req.body.tags;
  fields.createdBy = req.user._id;
  codes.forEach((c) => {
    fields[`name_${c}`] = req.body[`name_${c}`];
    fields[`description_${c}`] = req.body[`description_${c}`];
  });
  return fields;
}

async function formatEditInputs(id) {
  const productTranslations = await ProductTranslation.find({
    product: id,
  });
  const inputsNames = {};
  productTranslations.forEach((c) => {
    inputsNames[`name_${c.code}`] = c.name;
    inputsNames[`description_${c.code}`] = c.description;
  });
  inputsNames.id = id;
  return inputsNames;
}

function manageEdit(fields, products) {
  products.forEach(async (p) => {
    await ProductTranslation.findByIdAndUpdate(p._id, {
      name: fields[`name_${p.code}`],
      description: fields[`description_${p.code}`],
    });
  });
}

module.exports = {
  display_add_product_page,
  display_edit_product_page,
  add_product,
  edit_product,
  formatEditInputs,
  getFields,
};
