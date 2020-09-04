const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const { findById } = require('../models/categoryModel');
const { validationResult } = require('express-validator');
const { getErrorsObject } = require('../functions');

const dashboardController = (req, res) => {
    res.render('dashboard/index', { layout: 'admin' });
}


// Product
const getAddProductController = async (req, res) => {
    const categories = await Category.find();
    res.render('dashboard/product/add', { 
        layout: 'admin', 
        categories: categories.map(category => category.toJSON()),
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
        formTitle: 'Edit Product'
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
            const categories = await Category.find();
            console.log(errors);
            return res.render('dashboard/product/add', { 
                layout: 'admin', 
                categories: categories.map(category => category.toJSON()),
                formTitle: 'Add Product',
                errorObject: getErrorsObject(errors) 
            });
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
    res.render('dashboard/category/add', { layout: 'admin'});
}

const postAddCategoryController = async (req, res) => {
    try{
        const { categoryName, categoryDescription } = req.body
        const category = await Category.create({ categoryName, categoryDescription });
        res.redirect('/admin-panel/category/add');
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

// Login
const getLoginController = (req, res) => {
    res.render('dashboard/login', { layout: false });
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
    putEditProductController
}