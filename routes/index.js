const { Router } = require('express');
const router = Router();


// @GET     @desc: show index page
router.get('/', (req, res) => {
    res.send('hi');
});



module.exports = router;