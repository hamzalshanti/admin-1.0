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
    res.render('dashboard/product/add', { 
        layout: 'admin', 
        categories: categories.map(category => category.toJSON()),
        product: req.flash('product')[0],
        errorObject: req.flash('errorObject')[0],
        formTitle: 'Add Product'
    });
}

const getEditProductController = async (req, res) => {
    const categories = await Category.find();
    const product = await Product.findById(req.params.id);
    res.render('dashboard/product/add', { 
        layout: 'admin', 
        categories: categories.map(category => category.toJSON()),
        product: product.toJSON(),
        errorObject: req.flash('errorObject')[0],
        formTitle: 'Edit Product',
        isEdit: true,
    });
}

const postAddProductController = async (req, res) => {
    try {
        const { 
            productName, 
            productPrice, 
            productQty, 
            productDescription,
            category,
            productTags
        } = req.body
        let { errors } = validationResult(req);
        if(errors.length > 0) {
            req.flash('errorObject', getErrorsObject(errors));
            req.flash('product', {
            productName, 
            productPrice, 
            productQty, 
            productDescription,
            category,
            productTags
            })
            res.redirect('/admin-panel/product/add');
        }
        const product = await Product.create({
            productName,
            productPrice,
            productQty,
            productDescription,
            category,
            productImages: req.files.map(file => file.filename),
            productTags: productTags.toLowerCase().replace(/, /g, ','),
        });
        req.flash('success', 'Create Product Succssfuly ..');
        res.redirect('/admin-panel/product/show');
    } catch(error) {
        console.log(error);
    }
}

const putEditProductController = async (req, res) => {
    try {
        const { 
            productName, 
            productPrice, 
            productQty, 
            productDescription,
            category,
            productTags
        } = req.body
        let { errors } = validationResult(req);
        if(errors.length > 0) {
            req.flash('errorObject', getErrorsObject(errors));
            res.redirect('/admin-panel/product/edit/' + req.body.productId);
        }
        const newData = {
            productName,
            productPrice,
            productQty,
            productDescription,
            category,
            productTags: productTags.toLowerCase().replace(/, /g, ',')
        }
        if(req.files.length > 0) newData.productImages = req.files.map(file => file.filename)
        const product = await Product.findByIdAndUpdate(req.body.productId, newData);
        req.flash('success', 'Modified Product Successfuly ..');
        res.redirect('/admin-panel/product/show');
    } catch(error) {

    }
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
//End Product

// Category
const getAddCategoryController = (req, res) => {
    res.render('dashboard/category/add', { 
        layout: 'admin', 
        category: req.flash('category')[0],
        errorObject: req.flash('errorObject')[0],
        formTitle: 'Add Category'
    });
}

const postAddCategoryController = async (req, res) => {
    try{
        const { categoryName, categoryDescription } = req.body
        let { errors } = validationResult(req);
        if(errors.length > 0) {
            req.flash('errorObject', getErrorsObject(errors));
            req.flash('category', { categoryName, categoryDescription });
            res.redirect('/admin-panel/category/add');
        }
        const product = await Product.create({ categoryName, categoryDescription });
        req.flash('success', 'Create Category Succssfuly ..');
        res.redirect('/admin-panel/category/show');
    } catch(error) {
        console.log(error);
    }
}

const showCategoriesController = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('dashboard/category/show', { 
            layout: 'admin', 
            categories: categories.map(category => category.toJSON())
        });
    } catch(error) {
        console.log(error);
    }
}

const getEditCategoryController = async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.render('dashboard/category/add', { 
        layout: 'admin', 
        category: category.toJSON(),
        errorObject: req.flash('errorObject')[0],
        formTitle: 'Edit Category',
        isEdit: true,
    });
}

const putEditCategoryController = async (req, res) => {
    try {
        const { categoryName, categoryDescription} = req.body
        let { errors } = validationResult(req);
        if(errors.length > 0) {
            req.flash('errorObject', getErrorsObject(errors));
            res.redirect('/admin-panel/category/edit/' + req.body.categoryId);
        }
        newData = {
            categoryName,
            categoryDescription
        }
        const category = await Product.findByIdAndUpdate(req.body.categoryId, newData);
        req.flash('success', 'Modified Product Successfuly ..');
        res.redirect('/admin-panel/category/show');
    } catch(error) {

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

const getAddUserController = (req, res) => {
    console.log();
    user = req.flash('user')[0],
    errorObject = req.flash('errorObject')[0]
    res.render('dashboard/user/add', 
    {
        layout: 'admin',
        formTitle: 'Add User',
        roles: [{ position: 'buyer' }, { position: 'admin' }],
        user,
        errorObject,
    });
}
const postAddUserController = async (req, res) => {
    try {
        const { fullName, email, password, position } = req.body
        let { errors } = validationResult(req);
        if(errors.length > 0) {
            req.flash('errorObject', getErrorsObject(errors));
            req.flash('user', {
                fullName, 
                email, 
                password, 
                position
            });
            return res.redirect('/admin-panel/user/add');     
        }
        const user = await User.create({
            fullName, 
            email, 
            password: await hashPassword(password), 
            position
        });
        req.flash('success', 'Create User Succssfuly ..');
        return res.redirect('/admin-panel/user/show');
    } catch(errors) {
        console.log(errors);
    }
}

const getEditUserController = async (req, res) => {
    const roles = [{ position: 'buyer' }, { position: 'admin' }]
    const user = await User.findById(req.params.id);
    res.render('dashboard/user/add', { 
        layout: 'admin', 
        roles,
        user: user.toJSON(),
        errorObject: req.flash('errorObject')[0],
        formTitle: 'Edit user',
        isEdit: true,
    });
}

const putEditUserController = async (req, res) => {
    try {
        const { 
            fullName,
            email,
            password,
            position
        } = req.body
        let { errors } = validationResult(req);
        if(errors.length > 0) {
            console.log(errors);
            errors.map(error => {
                if(error.msg === 'email already exist');
            })
            req.flash('errorObject', getErrorsObject(errors));
            res.redirect('/admin-panel/user/edit/' + req.body.userId);
        }
        const newData = {
            fullName,
            position
        }
        if(password !== 'stillPass') newData.password = password;
        if(email !== 'email@example.ha') newData.email = email;
        const user = await User.findByIdAndUpdate(req.body.userId, newData);
        req.flash('success', 'Modified User Successfuly ..');
        res.redirect('/admin-panel/user/show');
    } catch(error) {

    }
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
    putEditCategoryController
}