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
const _ = require('lodash');

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
function display_edit_product_page({ req, res, type, item, page, arrayType }) {
  const args = set_render_args({ req, type, page, arrayType });
  args.isEdit = true;
  args.item = item.toJSON();
  redirect_page({ res, type, args });
}

// Add Product
async function add_product({ req, res, type, fields }) {
  const redirectLink = check_add_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  fields = modify_product_fields({ req, fields });
  await Product.create(fields);
  added_message({ req, type });
  successful_redirect({ req, res, type });
}

// Edit Product
async function edit_product({ req, res, type, fields }) {
  const redirectLink = check_edit_errors({ req, res, type, fields });
  if (redirectLink) return res.redirect(redirectLink);
  fields = modify_product_fields({ req, fields });
  await Product.findByIdAndUpdate(req.body.itemId, fields);
  modefied_message({ req, type });
  successful_redirect({ req, res, type });
}

// Modify productTags and uploaded files
function modify_product_fields({ req, fields }) {
  if (req.files['productGallary'])
    if (req.files['productGallary'].length > 0)
      fields.productGallary = req.files['productGallary'].map(
        (file) => file.filename
      );
  if (req.files['mainImage'])
    if (req.files['mainImage'].length > 0)
      fields.mainImage = req.files['mainImage'][0].filename;

  fields.productTags = fields.productTags.toLowerCase().replace(/, /g, ',');
  return fields;
}

module.exports = {
  display_add_product_page,
  display_edit_product_page,
  add_product,
  edit_product,
};
