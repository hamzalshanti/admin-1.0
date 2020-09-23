const { Router } = require('express');
const router = Router();
const {
  get_add_product,
  post_add_product,
  get_show_products,
  get_edit_product,
  put_edit_product,
  delete_product,
} = require('../../controllers/adminControllers/productController');

const uploader = require('../../middlewares/multerMiddleware');
const upload = uploader.fields([
  {
    name: 'mainImage',
    maxCount: 1,
  },
  {
    name: 'gallary',
    maxCount: 5,
  },
]);
const { productValidation } = require('../../validation');

router.get('/show', get_show_products);
router.get('/add', get_add_product);
router.get('/edit/:id', get_edit_product);
router.post('/add', upload, productValidation, post_add_product);
router.put('/edit', upload, productValidation, put_edit_product);
router.delete('/show', delete_product);

module.exports = router;
