const {
  set_render_args,
  redirect_page,
  modefied_message,
  added_message,
  successful_redirect,
  check_add_errors,
  check_edit_errors,
} = require('./commonFn');
const Product = require('../../models/productModel');
const Tag = require('../../models/tagModel');
const { cloudinary } = require('../../config/cloudinary');
const datauri = require('datauri');
const DatauriParser = require('datauri/parser');
const path = require('path');
const { log } = require('console');

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
function display_add_product_page({ req, res, type, page, arrayType }) {
  const args = set_render_args({ req, type, page, arrayType });
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
}) {
  const args = set_render_args({ req, type, page, arrayType });
  args.isEdit = true;
  let tags = await getTags(item.tags);
  args.tags = separateTags(tags).replace(/(^,)|(,$)/g, '');
  args.item = item.toJSON();
  redirect_page({ res, type, args });
}

// Add Product
async function add_product({ req, res, type, fields }) {
  const redirectLink = check_add_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  fields = await modify_product_fields({ req, fields });
  await Product.create(fields);
  added_message({ req, type });
  successful_redirect({ req, res, type });
}

// Edit Product
async function edit_product({ req, res, type, fields }) {
  const redirectLink = check_edit_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  fields = await modify_product_fields({ req, fields });
  await Product.findByIdAndUpdate(req.body.itemId, fields);
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
  fields.tags = await formatTags(req.body.tags);
  return fields;
}

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

module.exports = {
  display_add_product_page,
  display_edit_product_page,
  add_product,
  edit_product,
};
