

const User = require('../models/userModel');

const editUser = async (req, res, next) => {
    if(req.body.itemId) { 
    if(req.body.password === '' && req.body.confirmPassword === '') 
        req.body.password = req.body.confirmPassword = 'stillPass';
    const user1 = await User.findById(req.body.itemId);
    if(user1.googleId || user1.facebookId) {
        if(req.body.email) {
            req.flash('errorObject', { email: 'you cant cahnge email' });
            return res.redirect(`/admin-panel/user/edit/${req.body.itemId}`);
        }
        req.body.email = 'email@example.ha';
        req.body.password = req.body.confirmPassword = 'stillPass';
        return next();
    }
    const user2 = await User.findOne({ email: req.body.email});
    if(user2)
        if(user2._id == req.body.itemId) {
            req.body.email = 'email@example.ha';
        }
    }    
    next();
}


module.exports = {
    editUser
}