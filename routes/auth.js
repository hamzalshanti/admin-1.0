const { Router } = require('express');
const router = Router();
const { getLoginController, getSignupController, postSignupController } = require('../controllers/authController');
const { singupValidation } = require('../validation');
const passport = require('passport');

// @GET     @Desc: show signup page
router.get('/signup', getSignupController);

// @POST    @Desc: create new user
router.post('/signup', singupValidation, postSignupController);


// @GET     @Desc: show login page
router.get('/login', getLoginController);

//@POST     @Desc: login to page
router.post('/login', passport.authenticate(
    'local', 
    { 
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
    }
    )
);


module.exports = router;