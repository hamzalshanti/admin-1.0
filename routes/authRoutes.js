const { Router } = require('express');
const router = Router();
const passport = require('passport');
// Controllers
const {
  get_login,
  get_signup,
  post_signup,
  get_logout,
} = require('../controllers/authController');

// Middlewares
const { siteGuard, registerGuard } = require('../middlewares/authMiddleware');

// Validation
const { singupValidation } = require('../validation');

// @GET     @Desc: show signup page
router.get('/signup', registerGuard, get_signup);

// @POST    @Desc: create new user
router.post('/signup', registerGuard, singupValidation, post_signup);

// @GET     @Desc: show login page
router.get('/login', registerGuard, get_login);

//@POST     @Desc: login to page
router.post(
  '/login',
  registerGuard,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

// @desc    Auth with Google
// @route   GET /auth/google
router.get(
  '/google',
  registerGuard,
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @desc    callback
// @route   GET /auth/google/callback
router.get(
  '/google/redirect',
  registerGuard,
  passport.authenticate('google', {
    failureRedirect: '/auth/login',
    successRedirect: '/',
  })
);

router.get(
  '/facebook',
  registerGuard,
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get(
  '/facebook/redirect',
  registerGuard,
  passport.authenticate('facebook', {
    failureRedirect: '/auth/login',
    successRedirect: '/',
  })
);

// @GET     @DESC: logout
router.get('/logout', siteGuard, get_logout);

module.exports = router;
