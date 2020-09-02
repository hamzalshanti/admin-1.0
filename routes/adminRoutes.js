const { Router } = require('express');
const router = Router();


router.get('/', (req, res) => {
    res.render('dashboard/index', { layout: 'admin' });
});


router.get('/product/add', (req, res) => {
    res.render('dashboard/addProduct', { layout: 'admin' });
});

router.get('/product/show', (req, res) => {
    res.render('dashboard/showProduct', { layout: 'admin' });
});

router.get('/login', (req, res) => {
    res.render('dashboard/login', { layout: false });
});



module.exports = router;