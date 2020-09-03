const Category = require('../models/categoryModel');
const Product = require('../models/productModel');


const dashboardController = (req, res) => {
    res.render('dashboard/index', { layout: 'admin' });
}


// Product
const getAddProductController = async (req, res) => {
    const categories = await Category.find();
    res.render('dashboard/product/add', { 
        layout: 'admin', 
        categories: categories.map(category => category.toJSON())
    });
}

const postAddProductController = async (req, res) => {
    console.log(req.files);
    try {
        const { 
            productName, 
            productPrice, 
            productQty, 
            productDescription,
            category,
            productTags
        } = req.body
        const product = await Product.create({
            productName,
            productPrice,
            productQty,
            productDescription,
            category,
            productTags: productTags.toLowerCase().replace(/, /g, ',')
        });
        console.log('Product add Done');
    } catch(error) {
        console.log(error);
    }


}

const showProductsController = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('dashboard/product/show', { 
            layout: 'admin', 
            products: products.map(product => product.toJSON())
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
    getLoginController,
    getAddCategoryController,
    postAddCategoryController,
    showCategoriesController,
}