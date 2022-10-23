const { verifyToken } = require('../services/userService');

module.exports = () => (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const userData = verifyToken(token);
            req.user = userData;
            res.locals.username = userData.username;
            res.locals.address = userData.address;
        } catch (err) {
            res.clearCookie('token');
            res.redirect('/auth/login');
            return;
        }
    }
    next();
};