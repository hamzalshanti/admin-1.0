const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const { findById } = require('../models/categoryModel');
const { validationResult } = require('express-validator');
const { getErrorsObject, hashPassword } = require('../functions');
const User = require('../models/userModel');

const dashboardController = (req, res) => {
    res.render('dashboard/index', { layout: 'admin' });
}

// Login
const getLoginController = (req, res) => {
    res.render('dashboard/login', { 
        layout: false,
        error:  req.flash('error')[0]
     });
}


/****************Product Controllers*****************/

// Show Products Controller
const get_show_products = async (req, res) => {
    try {
        const products = await Product.find();
        show_items(req, res, 'product', products);
    } catch(error) {
        console.log(error);
    }
}

// Get Add Product Page Contoller
const get_add_product = async (req, res) => {
    const categories = await Category.find();
    display_add_product_page(req, res, 'product', categories)
}

// Get Edit Product Page Controller
const get_edit_product = async (req, res) => {
    const categories = await Category.find();
    const product = await Product.findById(req.params.id);
    display_edit_product_page(req, res, 'product', product, categories)
}

// Create Product Controller
const post_add_product = async (req, res) => {
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

// Edit Product Controller
const put_edit_product = async (req, res) => {
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

// Delete Product Controller
const delete_product = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.body.id);
        res.redirect('/admin-panel/product/show');
    } catch {

    }
}


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

/************* User Controllers ***********************/

// Show Users Controller
const get_show_users = async (req, res) => {
    try {
        const users = await User.find();
        show_items(req, res, 'user', users);
    } catch(error) {
        console.log(error);
    }
}

// Get Add User Page Controller
const get_add_user = async (req, res) => {
    const roles = [{ position: 'buyer' }, { position: 'admin' }];
    display_add_user_page(req, res, 'user', roles);
}

// Get Edit User Page Controller
const get_edit_user = async (req, res) => {
    const roles = [{ position: 'buyer' }, { position: 'admin' }]
    const user = await User.findById(req.params.id);
    display_edit_user_page(req, res, 'user', user, roles);
}

// Create User Controller
const post_add_user = async (req, res) => {
    const fields = { 
        fullName: req.body.fullName, 
        email: req.body.email, 
        password: req.body.password, 
        position: req.body.position 
    }
    add_user(req, res, 'user', fields);

}

// Edit User Controller
const put_edit_user = async (req, res) => {
    const fields = { 
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        position: req.body.position
    }
    edit_user(req, res, 'user', fields);
}

// Delete User Controller
const delete_user = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.body.id);
        res.redirect('/admin-panel/user/show');
    } catch {

    }
}


function show_items(req, res, type, items) {
    return res.render(`dashboard/${type}/show`, { 
        layout: 'admin', 
        items: items.map(user => user.toJSON()),
        success: req.flash('success')[0],
    });
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
    get_add_product,
    post_add_product,
    get_show_products,
    get_edit_product,
    getLoginController,
    get_add_category,
    post_add_category,
    get_show_categories,
    put_edit_product,
    get_add_user,
    post_add_user,
    get_show_users,
    get_edit_user,
    put_edit_user,
    get_edit_category,
    put_edit_category,
    delete_product,
    delete_category,
    delete_user,
}