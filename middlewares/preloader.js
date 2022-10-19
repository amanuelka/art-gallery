const { getById, getByIdNoLean } = require('../services/publicationService');

module.exports = (lean) => async (req, res, next) => {
    res.locals.publication = lean
        ? await getById(req.params.id)
        : await getByIdNoLean(req.params.id);
    next();
}