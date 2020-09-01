const { Router } = require('express');
const router = Router();
const { getHomeController } = require('../controllers/indexController');


// @GET     @desc: show index page
router.get('/', getHomeController);


module.exports = router;