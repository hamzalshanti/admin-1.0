const { Router } = require('express');
const router = Router();
const passport = require('passport');
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
    showUsersController
} = require('../controllers/adminController');

const uploader = require('../middlewares/multerMiddleware');
const upload = uploader.array('productImage', 10);
const { productValidation, singupValidation } = require('../validation');
const { adminGuard, registerGuard } = require('../middlewares/authMiddleware');


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

router.delete('/product/show', (req, res) => {
    res.send('Delete');
});

router.put('/product/show', (req, res) => {
    res.send('Edit');
});

// Category
router.get('/category/add', getAddCategoryController);

router.post('/category/add', postAddCategoryController);

router.get('/category/show', showCategoriesController);

// User 
router.get('/user/show', showUsersController);
router.get('/user/add', getAddUserController);
router.post('/user/add', singupValidation, postAddUserController);


module.exports = router;