const { hasUser } = require('../middlewares/guards');
const User = require('../models/User');
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

homeController.get('/404', async (req, res) => {
    res.render('404', { title: 'Error Page' });
});

homeController.get('/profile', hasUser(), async (req, res) => {
    const user = await User.findById(req.user._id).populate('publications').populate('shares').lean();
    const publicationTitles = user.publications.map(p => p.title).join(', ');
    const sharedTitles = user.shares.map(p => p.title).join(', ');
    res.render('profile', { title: 'My profile', ...user, publicationTitles, sharedTitles });
});

module.exports = homeController;