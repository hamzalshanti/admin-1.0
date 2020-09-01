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

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google',  passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    callback
// @route   GET /auth/google/callback
router.get(
    '/google/redirect', 
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    (req, res) => {
        res.redirect('/')
    }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/redirect', passport.authenticate('facebook', { failureRedirect: '/auth/login' }), 
(req, res) => {
    res.redirect('/');
});


// @GET     @DESC: logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;