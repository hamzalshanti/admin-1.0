const siteGuard = (req, res, next) => {
    if(req.isAuthenticated()) return next();
    return res.redirect('/auth/login');
}
const registerGuard = (req, res, next) => {
    if(!req.isAuthenticated()) return next();
    return res.redirect('/');
}

module.exports = {
    siteGuard, 
    registerGuard
}