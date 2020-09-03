const { Router } = require('express');
const router = Router();
const {
    dashboardController,
    getAddProductController,
    postAddProductController,
    showProductsController,
    getLoginController,
    getAddCategoryController,
    postAddCategoryController,
    showCategoriesController,
    getEditProductController
} = require('../controllers/adminController');

const uploader = require('../middlewares/multerMiddleware');
const upload = uploader.array('productImage', 10);


router.get('/', dashboardController);


// Product
router.get('/product/add', getAddProductController);

router.get('/product/edit/:id', getEditProductController);

router.post('/product/add', upload, postAddProductController);

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

// Login
router.get('/login', getLoginController);



module.exports = router;