const { body } = require('express-validator');
const User = require('./models/userModel');

const singupValidation = [
        body('fullName').notEmpty().withMessage('full Name required'),
        body('email').isEmail().withMessage('invalid email').custom( async (value, {req}) => {
            user = await User.findOne({ email: value })
           if(user) throw 'email already exist'
            return true
        }),
        body('password').isLength({ min: 3 }).withMessage('password must at least 3'),
        body('confirmPassword').custom( (value, {req}) => {
            if(value === req.body.password) return true;
            throw 'passwords not match';
        })
]

const productValidation = [
    body('productName').notEmpty().withMessage('name can not be empty'),
    body('productPrice').notEmpty().withMessage('price can not be empty').isNumeric().withMessage('price must be number'),
    body('productQty').notEmpty().withMessage('Qty can not be empty').isNumeric().withMessage('Qty must be number'),
    body('productDescription').notEmpty().withMessage('Description can not be empty'),
    body('category').notEmpty().withMessage('please select category')
]

const categoryValidation = [
    body('categoryName').notEmpty().withMessage('category name cannot be empty'),
    body('categoryDescription').notEmpty().withMessage('category description cannot be empty'),
]

module.exports = {
    singupValidation,
    productValidation,
    categoryValidation,
}