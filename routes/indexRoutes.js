const { Router } = require('express');
const router = Router();
const { getHomeController } = require('../controllers/indexController');
const { siteGuard } = require('../middlewares/authMiddleware');

// @GET     @desc: show index page
router.get('/', siteGuard, getHomeController);




module.exports = router;