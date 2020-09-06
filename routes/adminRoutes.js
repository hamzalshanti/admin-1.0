const { Router } = require('express');
const router = Router();
const passport = require('passport');
const User = require('../models/userModel');
const {
    dashboardController,
    getAddProductController,
    postAddProductController,
    showProductsController,
    getLoginController,
    getAddCategoryController,
    postAddCategoryController,
    showCategoriesController,
    getEditProductController,
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
} = require('../controllers/adminController');

const uploader = require('../middlewares/multerMiddleware');
const upload = uploader.array('productImage', 10);
const { productValidation, singupValidation, categoryValidation } = require('../validation');
const { adminGuard, registerGuard } = require('../middlewares/authMiddleware');
const { editUser } = require('../middlewares/userMiddleware');



// Login
router.get('/login', registerGuard, getLoginController);
router.post('/login', registerGuard, passport.authenticate(
    'admin-login', 
    { 
        successRedirect: '/admin-panel',
        failureRedirect: '/admin-panel/login',
        failureFlash: true,
    }
));




router.use(adminGuard);

router.get('/', dashboardController);


// Product
router.get('/product/add', getAddProductController);

router.get('/product/edit/:id', getEditProductController);

router.post('/product/add', upload, productValidation, postAddProductController);

router.put('/product/edit', upload, productValidation, putEditProductController);

router.get('/product/show', showProductsController);

router.delete('/category/show', deleteCategoryController);

router.delete('/product/show', deleteProductController);


// Category
router.get('/category/add', getAddCategoryController);
router.post('/category/add', categoryValidation, postAddCategoryController);
router.get('/category/show', showCategoriesController);
router.get('/category/edit/:id', getEditCategoryController);
router.put('/category/edit', categoryValidation, putEditCategoryController);

// User 
router.get('/user/show', showUsersController);
router.get('/user/add', getAddUserController);
router.post('/user/add', singupValidation, postAddUserController);
router.get('/user/edit/:id', getEditUserController);
router.put('/user/edit', editUser, singupValidation, putEditUserController);
router.delete('/user/show', deleteUserController);


module.exports = router;