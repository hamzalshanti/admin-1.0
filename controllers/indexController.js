const get_index = (req, res) => {
    res.render('matjri/index', {
        title: 'Home'
    });
}

const get_cart = (req, res) => {
    res.render('matjri/cart', {
        title: 'Cart'
    });
}

const get_shop = (req, res) => {
    res.render('matjri/shop', {
        title: 'shop'
    });
}

const get_single_product = (req, res) => {
    res.render('matjri/single-product', {
        title: 'Product'
    });
}

const get_checkout = (req, res) => {
    res.render('matjri/checkout', {
        title: 'checkout'
    });
}


const get_order = (req, res) => {
    res.render('matjri/order', {
        title: 'Order'
    });
}

module.exports = {
    get_index,
    get_cart,
    get_shop,
    get_single_product,
    get_checkout,
    get_order
}