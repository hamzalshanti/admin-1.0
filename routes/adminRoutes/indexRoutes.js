const { Router } = require('express');
const router = Router({mergeParams: true});
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const userRoutes = require('./userRoutes');
const passport = require('passport');
const { show_dashboard, admin_login } = require('../../controllers/adminControllers/indexController');
const { adminGuard, registerGuard } = require('../../middlewares/authMiddleware');



// Login
router.get('/login', registerGuard, show_dashboard);
router.post('/login', registerGuard, passport.authenticate(
    'admin-login', 
    { 
        successRedirect: '/admin-panel',
        failureRedirect: '/admin-panel/login',
        failureFlash: true,
    }
));




router.use(adminGuard);

router.get('/', show_dashboard);

router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/user', userRoutes);


module.exports = router;