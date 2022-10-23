const { getById } = require('../services/publicationService');

function preload() {
    return async function (req, res, next) {
        res.locals.publication = await getById(req.params.id);
        next();
    };
}

module.exports = preload;