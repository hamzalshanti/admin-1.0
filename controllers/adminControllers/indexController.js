
const show_dashboard = (req, res) => {
    res.render('dashboard/index', { layout: 'admin' });
}


const admin_login = (req, res) => {
    res.render('dashboard/login', { 
        layout: false,
        error:  req.flash('error')[0]
     });
}

module.exports = {
    show_dashboard,
    admin_login,
}