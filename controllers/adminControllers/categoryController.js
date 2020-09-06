const Category = require('../../models/categoryModel');
const { getErrorsObject } = require('../../functions/authFn');
const { validationResult } = require('express-validator');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const { 
    display_add_category_page,
    display_edit_category_page,
    add_category,
    edit_category,
 } = require('../../functions/adminFunctions/categoryFn');


/********************* Ctegory Controllers ****************************/

// Show Categories Controller
const get_show_categories = async (req, res) => {
    try {
        const categories = await Category.find();
        show_items(req, res, 'category', categories);
    } catch(error) {
        console.log(error);
    }
}

// Get Add Category Page Controller
const get_add_category = async (req, res) => {
    display_add_category_page(req, res, 'category');
}


// Get Edit Category Page Controller
const get_edit_category = async (req, res) => {
    const category = await Category.findById(req.params.id);
    display_edit_category_page(req, res, 'category', category);
}

// Create Category Controller
const post_add_category = async (req, res) => {
    const fields = { 
        categoryName: req.body.categoryName, 
        categoryDescription: req.body.categoryDescription 
    }
    add_category(req, res, 'category', fields); 
}

// Edit Category Controller
const put_edit_category = async (req, res) => {
    const fields = { 
        categoryName: req.body.categoryName, 
        categoryDescription: req.body.categoryDescription 
    }
    await edit_category(req, res, 'category', fields);
}

// Delete Category Controller
const delete_category = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.body.id);
        res.redirect('/admin-panel/category/show');
    } catch {

    }
}

module.exports = {
    get_show_categories,
    get_add_category,
    get_edit_category,
    post_add_category,
    put_edit_category,
    delete_category,
}