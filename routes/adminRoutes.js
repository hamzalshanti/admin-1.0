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

} = require('../controllers/adminController');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

const upload = multer({
    storage: storage,
   // limits: {
      //  fieldSize: 1024 * 1024 * 5
    //},
    //fileFilter: fileFilter
});

router.get('/', dashboardController);


// Product
router.get('/product/add', getAddProductController);

router.post('/product/add', upload.array('productImage', 10), postAddProductController);

router.get('/product/show', showProductsController);

// Category
router.get('/category/add', getAddCategoryController);

router.post('/category/add', postAddCategoryController);

router.get('/category/show', showCategoriesController);

// Login
router.get('/login', getLoginController);



module.exports = router;