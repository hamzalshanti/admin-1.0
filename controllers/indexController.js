

const getHomeController = (req, res) => {
    res.render('index', { title: 'Home' });
}

module.exports = {
    getHomeController
}