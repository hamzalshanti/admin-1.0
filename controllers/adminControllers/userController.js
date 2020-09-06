const User = require('../../models/userModel');
const { getErrorsObject, hashPassword } = require('../../functions/authFn');
const { validationResult } = require('express-validator');
const { show_items } = require('../../functions/adminFunctions/commonFn');
const { 
    display_add_user_page,
    display_edit_user_page,
    add_user,
    edit_user,
 } = require('../../functions/adminFunctions/userFn');

/************* User Controllers ***********************/

// Show Users Controller
const get_show_users = async (req, res) => {
    try {
        const users = await User.find();
        show_items(req, res, 'user', users);
    } catch(error) {
        console.log(error);
    }
}

// Get Add User Page Controller
const get_add_user = async (req, res) => {
    const roles = [{ position: 'buyer' }, { position: 'admin' }];
    display_add_user_page(req, res, 'user', roles);
}

// Get Edit User Page Controller
const get_edit_user = async (req, res) => {
    const roles = [{ position: 'buyer' }, { position: 'admin' }]
    const user = await User.findById(req.params.id);
    display_edit_user_page(req, res, 'user', user, roles);
}

// Create User Controller
const post_add_user = async (req, res) => {
    const fields = { 
        fullName: req.body.fullName, 
        email: req.body.email, 
        password: req.body.password, 
        position: req.body.position 
    }
    add_user(req, res, 'user', fields);

}

// Edit User Controller
const put_edit_user = async (req, res) => {
    const fields = { 
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        position: req.body.position
    }
    edit_user(req, res, 'user', fields);
}

// Delete User Controller
const delete_user = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.body.id);
        res.redirect('/admin-panel/user/show');
    } catch {

    }
}

module.exports = {
    get_show_users,
    get_add_user,
    get_edit_user,
    post_add_user,
    put_edit_user,
    delete_user,
}