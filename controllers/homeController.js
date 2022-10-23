const { hasUser } = require('../middlewares/guards');
const { getAll, getOwn, getShared } = require('../services/publicationService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    const publications = await getAll();
    res.render('home', { publications });
});

homeController.get('/gallery', async (req, res) => {
    const publications = await getAll();
    res.render('catalog', { publications });
});

homeController.get('/404', async (req, res) => {
    res.render('404');
});

homeController.get('/profile', hasUser(), async (req, res) => {
    const publications = await getOwn(req.user._id);
    const published = publications.map(p => p.title).join(', ');

    const shares = await getShared(req.user._id);
    const shared = shares.map(s => s.title).join(', ');

    res.render('profile', { published, shared });
});

module.exports = homeController;