const { Router } = require('express');
const router = Router();
const {
    get_add_category,
    post_add_category,
    get_show_categories,
    get_edit_category,
    put_edit_category,
    delete_category
} = require('../../controllers/adminControllers/categoryController');

const { categoryValidation } = require('../../validation');


router.get('/show', get_show_categories);
router.get('/add', get_add_category);
router.post('/add', categoryValidation, post_add_category);
router.get('/edit/:id', get_edit_category);
router.put('/edit', categoryValidation, put_edit_category);
router.delete('/show', delete_category);


module.exports = router