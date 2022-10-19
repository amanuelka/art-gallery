const { hasUser } = require('../middlewares/guards');
const { getAll } = require('../services/publicationService');
const { getUserById } = require('../services/userService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const publications = await getAll();
    res.render('home', { title: 'Home Page', publications });
});

homeController.get('/gallery', async (req, res) => {
    const publications = await getAll();
    res.render('catalog', { title: 'Gallery', publications });
});

homeController.get('/profile', hasUser(), async (req, res) => {
    const user = await getUserById(req.user._id);
    res.render('profile', { title: 'My profile', user });
});

homeController.get('/404', async (req, res) => {
    res.render('404', { title: 'Error Page' });
});

module.exports = homeController;