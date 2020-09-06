const { Router } = require('express');
const router = Router();
const {
    get_add_user,
    post_add_user,
    get_show_users,
    get_edit_user,
    put_edit_user,
    delete_user
} = require('../../controllers/adminControllers/userController');

const { singupValidation } = require('../../validation');
const { editUser } = require('../../middlewares/userMiddleware');

router.get('/show', get_show_users);
router.get('/add', get_add_user);
router.get('/edit/:id', get_edit_user);
router.post('/add', singupValidation, post_add_user);
router.put('/edit', editUser, singupValidation, put_edit_user);
router.delete('/show', delete_user);

module.exports = router
