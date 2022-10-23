const { isGuest } = require('../middlewares/guards');
const { parseError } = require('../middlewares/parser');
const { register, login } = require('../services/userService');

const authController = require('express').Router();

authController.get('/register', isGuest(), (req, res) => {
    res.render('register');
});

authController.post('/register', isGuest(), async (req, res) => {
    try {
        if (Object.values(req.body).some(v => !v)) {
            throw new Error('All fields are required');
        }
        if (req.body.password.length < 3) {
            throw new Error('Password must be at least 3 characters long');
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match');
        }
        const token = await register(req.body.username, req.body.address, req.body.password);

        res.cookie('token', token);
        res.redirect('/');
    }
    catch (error) {
        const errors = parseError(error);
        res.render('register', {
            title: 'Register page',
            errors,
            body: {
                username: req.body.username,
                address: req.body.address
            }
        });
    }
});

authController.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

authController.post('/login', isGuest(), async (req, res) => {
    try {
        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    }
    catch (error) {
        const errors = parseError(error);
        res.render('login', { errors, body: { username: req.body.username } });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = authController;