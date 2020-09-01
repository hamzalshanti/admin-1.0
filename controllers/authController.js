const User = require('../models/userModel');
//const { signupValidation } = require('../validation');
const { body, validationResult } = require('express-validator');

const getLoginController = (req, res) => {
    res.render('login', { layout: false, title: 'Login', success: req.flash('success'), error: req.flash('error')[0] });
}

const getSignupController = (req, res) => {
    res.render('signup', { layout: false, title: 'Singup' });
}

const postSignupController = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;
        let { errors } = validationResult(req);
        if(errors.length > 0) return res.render('signup', { layout: false, title: 'Singup', fullName, email, errors });
        const user = new User ({ fullName, email, password });
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        console.log(user);
        await user.save();
        req.flash('success', 'created done you can login now');
        res.redirect('/auth/login');
    } catch(error) {
        console.log(error);
    }
}

module.exports = {
    getLoginController,
    getSignupController,
    postSignupController 
}