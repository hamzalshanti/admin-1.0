const Category = require('../../models/categoryModel');
const Product = require('../../models/productModel');
const { getErrorsObject } = require('../../functions/authFn');
const { validationResult } = require('express-validator');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const { 
    display_add_product_page,
    display_edit_product_page,
    add_product,
    edit_product,
 } = require('../../functions/adminFunctions/productFn');


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


module.exports = {
    get_show_products,
    get_add_product,
    get_edit_product,
    post_add_product,
    put_edit_product,
    delete_product,
}