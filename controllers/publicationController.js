const { hasUser, isOwner } = require('../middlewares/guards');
const preloader = require('../middlewares/preloader');
const Publication = require('../models/Publication');
const { create, deleteById, share, update } = require('../services/publicationService');
const { addPublication, addShare } = require('../services/userService');
const { parseError } = require('../util/parser');

const publicationController = require('express').Router();

publicationController.get('/create', hasUser(), (req, res) => {
    res.render('create', { title: 'Create publication' });
});

publicationController.post('/create', hasUser(), async (req, res) => {
    const data = { ...req.body, author: req.user._id };
    try {
        if (Object.values(data).some(v => !v)) {
            throw new Error('All fields are required');
        }
        const publication = await create(data);
        await addPublication(publication._id, req.user._id);
        res.redirect('/gallery');
    } catch (error) {
        res.render('create', {
            errors: parseError(error),
            body: data
        });
    }
});

publicationController.get('/:id', preloader(true), async (req, res) => {
    const publication = res.locals.publication;
    if (req.user) {
        publication.isAuthor = publication.author.toString() == req.user._id.toString();
        publication.shared = publication.users.map(x => x.toString()).includes(req.user._id.toString());
    }

    res.render('details', { ...publication });
});

publicationController.get('/:id/edit', hasUser(), preloader(true), isOwner(), async (req, res) => {
    const publication = res.locals.publication;
    res.render('edit', { title: 'Edit publication', publication });
});

publicationController.post('/:id/edit', hasUser(), preloader(), isOwner(), async (req, res) => {
    const publication = res.locals.publication;

    try {
        await update(publication, req.body);
        res.redirect(`/publications/${req.params.id}`);
    } catch (error) {
        res.render('edit', { errors: parseError(error), publication: req.body });
    }
});

publicationController.get('/:id/delete', hasUser(), preloader(), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/gallery');
});

publicationController.get('/:id/share', preloader(), async (req, res) => {
    const publication = res.locals.publication;
    if (publication.author.toString() != req.user._id.toString() &&
        publication.users.map(u => u.toString()).includes(req.user._id.toString()) == false) {
        await share(publication, req.user._id);
        await addShare(publication._id, req.user._id);
    }
    res.redirect(`/publications/${req.params.id}`);
});

module.exports = publicationController;