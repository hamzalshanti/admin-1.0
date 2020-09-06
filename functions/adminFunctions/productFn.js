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

/*********** Product Functions ****************/

// Display Add Product Page
function  display_add_product_page(req, res, type, arrayType) {
    const args = set_render_args(req, type, 'Add', arrayType);
    redirect_page(res, type, args)
}

// Display Edit Product Page
function display_edit_product_page(req, res, type, item, arrayType) {
    const args = set_render_args(req, type, 'Edit', arrayType);
    args.isEdit = true;
    args.item = item.toJSON();
    redirect_page(res, type, args)
}

// Add Product
async function add_product(req, res, type, fields) {
    const redirectLink = check_add_errors(req, res, type, fields);
    if(redirectLink) return res.redirect(redirectLink);
    fields = modify_product_fields(req, fields);
    await Product.create(fields);
    added_message(req, type);
    successful_redirect(req, res, type);
}

// Edit Product
async function edit_product(req, res, type, fields) {
    const redirectLink = check_edit_errors(req, res, type, fields);
    if(redirectLink) return res.redirect(redirectLink);
    fields = modify_product_fields(req, fields);
    await Product.findByIdAndUpdate(req.body.itemId, fields);
    modefied_message(req, type)
    successful_redirect(req, res, type);
}

// Modify productTags and uploaded files
function modify_product_fields(req, fields) {
    if(req.files.length > 0) fields.productImages = req.files.map(file => file.filename);
    fields.productTags = fields.productTags.toLowerCase().replace(/, /g, ',');
    return fields;
}


module.exports = {
    display_add_product_page,
    display_edit_product_page,
    add_product,
    edit_product,
}