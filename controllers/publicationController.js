const { hasUser, isOwner } = require('../middlewares/guards');
const { parseError } = require('../middlewares/parser');
const preloader = require('../middlewares/preloader');
const { create, deleteById, share, update, getById } = require('../services/publicationService');

const publicationController = require('express').Router();

publicationController.get('/create', hasUser(), (req, res) => {
    res.render('create');
});

publicationController.post('/create', hasUser(), async (req, res) => {
    const data = { ...req.body, author: req.user._id };
    try {
        if (Object.values(data).some(v => !v)) {
            throw new Error('All fields are required');
        }
        await create(data);
        res.redirect('/gallery');
    } catch (error) {
        res.render('create', { errors: parseError(error), ...data });
    }
});

publicationController.get('/:id', async (req, res) => {
    const publication = await getById(req.params.id);

    if (req.user) {
        publication.isAuthor = publication.author == req.user._id;
        publication.isShared = publication.shares.some(u => u._id == req.user._id);
    }

    res.render('details', { ...publication });
});

publicationController.get('/:id/edit', hasUser(), preloader(), isOwner(), async (req, res) => {
    const publication = res.locals.publication;
    res.render('edit', { ...publication });
});

publicationController.post('/:id/edit', hasUser(), preloader(), isOwner(), async (req, res) => {

    try {
        await update(req.params.id, { ...req.body, _id: req.params.id });
        res.redirect(`/publications/${req.params.id}`);
    } catch (error) {
        res.render('edit', { errors: parseError(error), ...req.body });
    }
});

publicationController.get('/:id/delete', hasUser(), preloader(), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/gallery');
});

publicationController.get('/:id/share', async (req, res) => {
    const publication = await getById(req.params.id);
    if (publication.author != req.user._id && publication.shares.some(u => u._id == req.user._id) == false) {
        await share(req.params.id, req.user._id);
    }
    res.redirect(`/publications/${req.params.id}`);
});

module.exports = publicationController;