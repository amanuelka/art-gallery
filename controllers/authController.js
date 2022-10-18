const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router();

authController.get('/register', (req, res) => {
    res.render('register', { title: 'Register page' });
});

authController.post('/register', async (req, res) => {
    try {
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

authController.get('/login', (req, res) => {
    res.render('login', { title: 'Login page' });
});

authController.post('/login', async (req, res) => {
    try {
        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    }
    catch (error) {
        const errors = parseError(error);
        res.render('login', {
            title: 'Login page',
            errors,
            body: {
                username: req.body.username
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = authController;