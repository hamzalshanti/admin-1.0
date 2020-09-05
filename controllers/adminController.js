const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const { findById } = require('../models/categoryModel');
const { validationResult } = require('express-validator');
const { getErrorsObject, hashPassword } = require('../functions');
const User = require('../models/userModel');
const { post } = require('../routes/adminRoutes');

const dashboardController = (req, res) => {
    res.render('dashboard/index', { layout: 'admin' });
}


// Product
const getAddProductController = async (req, res) => {
    const categories = await Category.find();
    await getAdd(req, res,'product', categories, {} , true);
}

const getEditProductController = async (req, res) => {
    const categories = await Category.find();
    const product = await Product.findById(req.params.id);
    await getAdd(req, res, 'product', categories, product, true, true);
}

const postAddProductController = async (req, res) => {
    try {
        const fields = { 
            productName: req.body.productName, 
            productPrice: req.body.productPrice, 
            productQty: req.body.productQty, 
            productDescription: req.body.productDescription,
            category: req.body.category,
            productTags: req.body.productTags
        }
        await postAdd(req, res, 'product', fields);
    } catch(error) {

    }
}

const putEditProductController = async (req, res) => {
    try {
        const fields = { 
            productName: req.body.productName, 
            productPrice: req.body.productPrice, 
            productQty: req.body.productQty,
            productDescription: req.body.productDescription,
            category: req.body.category,
            productTags: req.body.productTags
        } 
        await postAdd(req, res, 'product', fields, 'edit');
    }catch(error) {

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
const getAddCategoryController = async (req, res) => {
    await getAdd(req, res, 'category');
}

const postAddCategoryController = async (req, res) => {
    try{
        const fields = { 
            categoryName: req.body.categoryName, 
            categoryDescription: req.body.categoryDescription 
        }
        postAdd(req, res, 'category', fields);
    } catch(error) {
        console.log(error);
    }
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
    await getAdd(req, res, 'category', [], category, true, true);
}

const putEditCategoryController = async (req, res) => {
    try {
        const fields = { 
            categoryName: req.body.categoryName, 
            categoryDescription: req.body.categoryDescription 
        }
        await postAdd(req, res, 'category', fields, 'edit');
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

const getAddUserController = async (req, res) => {
    const roles = [{ position: 'buyer' }, { position: 'admin' }];
    await getAdd(req, res, 'user', roles);
}
const postAddUserController = async (req, res) => {
    try {
        const fields = { 
            fullName: req.body.fullName, 
            email: req.body.email, 
            password: req.body.password, 
            position: req.body.position 
        }
        await postAdd(req, res, 'user', fields);
    } catch(errors) {
        console.log(errors);
    }
}

const getEditUserController = async (req, res) => {
    const roles = [{ position: 'buyer' }, { position: 'admin' }]
    const user = await User.findById(req.params.id);
    await getAdd(req, res, 'user', roles, user, false, true);
}

const putEditUserController = async (req, res) => {
    try {
        const fields = { 
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password,
            position: req.body.position
        }
        await postAdd(req, res, 'user', fields, 'edit');
    } catch(error) {

    }
}

async function getAdd(req, res, type, arrayToSelect = [], item = {}, convertToJSON = false, isEdit = false) {
    try {
        const args = { 
            layout: 'admin', 
            [type]: req.flash(`${type}`)[0],
            errorObject: req.flash('errorObject')[0],
            arrayType: arrayToSelect,
            formTitle: `Add ${type}`
        }
        if(arrayToSelect.length > 0  && convertToJSON) args.arrayType = arrayToSelect.map(arr => arr.toJSON());
        if(!isEdit) return res.render(`dashboard/${type}/add`, args);
        args.item = item.toJSON();
        args.formTitle = `Edit ${type}`;
        args.isEdit = true;
        return res.render(`dashboard/${type}/add`, args);
    } catch(error) {
        console.log(error.message);
    }
}


async function postAdd(req, res, type, fields, command) {
    try {
        let { errors } = validationResult(req);
        if(errors.length > 0) {
            req.flash('errorObject', getErrorsObject(errors));
            req.flash(type, fields);
            if(command === 'edit') return res.redirect(`/admin-panel/${type}/${command}/${req.body.itemId}`);
            res.redirect(`/admin-panel/${type}/add`);
        }
        if(type === 'product') {
            if(req.files.length > 0) fields.productImages = req.files.map(file => file.filename);
            fields.productTags = fields.productTags.toLowerCase().replace(/, /g, ',');
            if(command === 'edit') 
                await Product.findByIdAndUpdate(req.body.itemId, fields);
            else
                await Product.create(fields);
        }
        //product

        if(type === 'user') {
            if(fields.password === 'stillPass') delete fields.password;
            if(fields.email === 'email@example.ha') delete fields.email;
            if(fields.password)
            fields.password = await hashPassword(fields.password);
            if(command === 'edit')
                await User.findByIdAndUpdate(req.body.itemId, fields);
            else
                await User.create(fields);
        }
        // user

        if(type === 'category') {
            if(command === 'edit')
                await Category.create(fields);
            else 
                await Category.findByIdAndUpdate(req.body.itemId, fields);
        }
        if(command === 'edit')
            req.flash('success', `Modified ${type} Successfuly ..`);
        else
            req.flash('success', `Create ${type} Succssfuly ..`);

        res.redirect(`/admin-panel/${type}/show`);
    } catch(error) {
        console.log(error);
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