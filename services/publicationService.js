const Publication = require('../models/Publication');

async function create(publication) {
    return Publication.create(publication);
};

async function getAll() {
    return Publication.find({}).lean();
};

async function getOwn(id) {
    return Publication.find({ author: id }).populate('author', 'address').lean();
};

async function getShared(id) {
    return Publication.find({ shares: id }).lean();
};

async function getById(id) {
    return Publication.findById(id).lean();
};

async function deleteById(id) {
    return Publication.findByIdAndDelete(id);
};

async function update(id, data) {
    const existing = await Publication.findById(id);
    Object.assign(existing, data);
    await existing.save();
};

async function share(id, userId) {
    const publication = await Publication.findById(id);
    publication.shares.push(userId);
    publication.sharesCount++;
    return publication.save();
};

module.exports = { getAll, getById, deleteById, update, create, share, getOwn, getShared };