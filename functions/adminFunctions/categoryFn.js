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

/*********** Category Functions ****************/

// Display Add Category Page
function display_add_category_page(req, res, type){
    const args = set_render_args(req, type, 'Add');
    redirect_page(res, type, args);
}

// Display Edit Category Page
async function display_edit_category_page(req, res, type, item){
    const args = set_render_args(req, type, 'Edit');
    args.isEdit = true;
    args.item = item.toJSON();
    redirect_page(res, type, args);
}

// Add Category
async function add_category(req, res, type, fields) {
    const redirectLink = check_add_errors(req, res, type, fields);
    if(redirectLink) return res.redirect(redirectLink);
    await Category.create(fields);
    added_message(req, type);
    successful_redirect(req, res, type);
}

// Edit Category
async function edit_category(req, res, type, fields) {
    const redirectLink = check_edit_errors(req, res, type, fields);
    if(redirectLink) return res.redirect(redirectLink);
    await Category.findByIdAndUpdate(req.body.itemId, fields);
    modefied_message(req, type)
    successful_redirect(req, res, type);
}


module.exports = {
    display_add_category_page,
    display_edit_category_page,
    add_category,
    edit_category,
}