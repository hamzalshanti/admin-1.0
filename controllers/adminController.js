const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const { findById } = require('../models/categoryModel');
const { validationResult } = require('express-validator');
const { getErrorsObject, hashPassword } = require('../functions');
const User = require('../models/userModel');

const dashboardController = (req, res) => {
    res.render('dashboard/index', { layout: 'admin' });
}

// Product
const getAddProductController = async (req, res) => {
    const categories = await Category.find();
    display_add_product_page(req, res, 'product', categories)
}

const getEditProductController = async (req, res) => {
    const categories = await Category.find();
    const product = await Product.findById(req.params.id);
    display_edit_product_page(req, res, 'product', product, categories)
}

const postAddProductController = async (req, res) => {
    const fields = { 
        productName: req.body.productName, 
        productPrice: req.body.productPrice, 
        productQty: req.body.productQty, 
        productDescription: req.body.productDescription,
        category: req.body.category,
        productTags: req.body.productTags
    }
    add_product(req, res, 'product', fields);
}

const putEditProductController = async (req, res) => {
    const fields = { 
        productName: req.body.productName, 
        productPrice: req.body.productPrice, 
        productQty: req.body.productQty,
        productDescription: req.body.productDescription,
        category: req.body.category,
        productTags: req.body.productTags
    }
    await edit_product(req, res, 'product', fields);
}

const showProductsController = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('dashboard/product/show', { 
            layout: 'admin', 
            products: products.map(product => product.toJSON()),
            success: req.flash('success')[0],
        });
    } catch(error) {
        console.log(error);
    }
}
const deleteProductController = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.body.id);
        res.redirect('/admin-panel/product/show');
    } catch {

    }
}
//End Product

// Category
const getAddCategoryController = async (req, res) => {
    display_add_category_page(req, res, 'category');
}

const postAddCategoryController = async (req, res) => {
    const fields = { 
        categoryName: req.body.categoryName, 
        categoryDescription: req.body.categoryDescription 
    }
    add_category(req, res, 'category', fields); 
}

const showCategoriesController = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('dashboard/category/show', { 
            layout: 'admin', 
            categories: categories.map(category => category.toJSON()),
            success: req.flash('success')[0],
        });
    } catch(error) {
        console.log(error);
    }
}

const getEditCategoryController = async (req, res) => {
    const category = await Category.findById(req.params.id);
    display_edit_category_page(req, res, 'category', category);
}

const putEditCategoryController = async (req, res) => {
    const fields = { 
        categoryName: req.body.categoryName, 
        categoryDescription: req.body.categoryDescription 
    }
    await edit_category(req, res, 'category', fields);
}

const deleteCategoryController = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.body.id);
        res.redirect('/admin-panel/category/show');
    } catch {

    }
}

// Login
const getLoginController = (req, res) => {
    res.render('dashboard/login', { 
        layout: false,
        error:  req.flash('error')[0]
     });
}



// Users
const showUsersController = async (req, res) => {
    try {
        const users = await User.find();
        res.render('dashboard/user/show', { 
            layout: 'admin', 
            users: users.map(user => user.toJSON()),
            success: req.flash('success')[0],
        });
    } catch(error) {
        console.log(error);
    }
}

const getAddUserController = async (req, res) => {
    const roles = [{ position: 'buyer' }, { position: 'admin' }];
    display_add_user_page(req, res, 'user', roles);
}
const postAddUserController = async (req, res) => {
    const fields = { 
        fullName: req.body.fullName, 
        email: req.body.email, 
        password: req.body.password, 
        position: req.body.position 
    }
    add_user(req, res, 'user', fields);

}

const getEditUserController = async (req, res) => {
    const roles = [{ position: 'buyer' }, { position: 'admin' }]
    const user = await User.findById(req.params.id);
    display_edit_user_page(req, res, 'user', user, roles);
}

const putEditUserController = async (req, res) => {
    const fields = { 
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        position: req.body.position
    }
    edit_user(req, res, 'user', fields);
}

const deleteUserController = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.body.id);
        res.redirect('/admin-panel/user/show');
    } catch {

    }
}


function  display_add_product_page(req, res, type, arrayType) {
    const args = set_responsed_args(req, type, 'Add', arrayType);
    redirect_page(res, type, args)
}
function display_edit_product_page(req, res, type, item, arrayType) {
    const args = set_responsed_args(req, type, 'Edit', arrayType);
    args.isEdit = true;
    args.item = item.toJSON();
    redirect_page(res, type, args)
}
function display_add_user_page (req, res, type, arrayType){
    const args = set_responsed_args(req, type, 'Add', arrayType);
    args.isNormalRegister = true;
    redirect_page(res, type, args)
}

async function display_edit_user_page (req, res, type, item, arrayType){
    const args = set_responsed_args(req, type, 'Edit', arrayType);
    args.isEdit = true;
    user = await User.findById(req.params.id);
    args.isNormalRegister = true;
    if(user.googleId || user.facebookId) args.isNormalRegister = false;
    args.item = user.toJSON();
    redirect_page(res, type, args)
}

function display_add_category_page(req, res, type){
    const args = set_responsed_args(req, type, 'Add');
    redirect_page(res, type, args);
}

async function display_edit_category_page(req, res, type, item){
    const args = set_responsed_args(req, type, 'Edit');
    args.isEdit = true;
    args.item = item.toJSON();
    redirect_page(res, type, args);
}

function set_responsed_args(req, type, page, arrayType = []) {
    let args = {
        layout: 'admin', 
        errorObject: req.flash('errorObject')[0],
        formTitle: `${page} ${type}`,
        arrayType,
        item: req.flash(type)[0]
    }
    try {
        args.arrayType = arrayType.map(arr => arr.toJSON());
        return args;
    } catch(error) {
       return args;
    }
}

function redirect_page(res, type, args) {
    return res.render(`dashboard/${type}/add`, args);
}

/*********** Product Functions ****************/

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


/*********** User Functions ****************/

// Add User
async function add_user(req, res, type, fields) {
    const redirectLink = check_add_errors(req, res, type, fields);
    if(redirectLink) return res.redirect(redirectLink);
    fields = await modify_user_fields(fields);
    await User.create(fields);
    added_message(req, type);
    successful_redirect(req, res, type);
}

// Edit User
async function edit_user(req, res, type, fields) {
    const redirectLink = check_edit_errors(req, res, type, fields);
    if(redirectLink) return res.redirect(redirectLink);
    fields = await modify_user_fields(fields);
    await User.findByIdAndUpdate(req.body.itemId, fields);
    modefied_message(req, type)
    successful_redirect(req, res, type);
}

// Modify email and password fields 
async function modify_user_fields(fields) {
    if(fields.password === 'stillPass') delete fields.password;
    if(fields.email === 'email@example.ha') delete fields.email;
    if(fields.password) fields.password = await hashPassword(fields.password);
    return fields
}

/*********** Category Functions ****************/

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


/*********** Common Functions ****************/

// Put successful Modified Massege Into Flash Request
function modefied_message(req, type) {
    req.flash('success', `Modified ${type} Successfuly ..`);
}

// Put successful Added Massege Into Flash Request
function added_message(req, type) {
    req.flash('success', `Create ${type} Succssfuly ..`);   
}

// Redirect User To Show Page Of Item Type if successful
function successful_redirect(req, res, type) {
    return res.redirect(`/admin-panel/${type}/show`);
}

// Check Errors In Edit Page Of Item Type
function check_edit_errors(req, res, type, fields) {
    errors  = check_errors(req, res, type, fields);
    if(errors.length > 0) return `/admin-panel/${type}/edit/${req.body.itemId}`;
    return;
}

// Check Errors In Add Page Of Item Type
function check_add_errors(req, res, type, fields) {
    errors  = check_errors(req, res, type, fields);
    if(errors.length > 0) return `/admin-panel/${type}/add`;
    return;
}

// Return Result Of Validation
function check_errors(req, res, type, fields) {
    let { errors } = validationResult(req);
    if(errors.length > 0) {
        req.flash('errorObject', getErrorsObject(errors));
        req.flash(type, fields);
    }
    return errors;
}



module.exports = {
    dashboardController,
    getAddProductController,
    postAddProductController,
    showProductsController,
    getEditProductController,
    getLoginController,
    getAddCategoryController,
    postAddCategoryController,
    showCategoriesController,
    putEditProductController,
    getAddUserController,
    postAddUserController,
    showUsersController,
    getEditUserController,
    putEditUserController,
    getEditCategoryController,
    putEditCategoryController,
    deleteProductController,
    deleteCategoryController,
    deleteUserController,
}