

const User = require('../models/userModel');

const editUser = async (req, res, next) => {
    if(req.body.password === '' && req.body.confirmPassword === '') 
        req.body.password = req.body.confirmPassword = 'stillPass';
    const user = await User.findOne({ email: req.body.email});
    if(user)
        if(user._id == req.body.userId) req.body.email = 'email@example.ha';
    next();
}


module.exports = {
    editUser
}