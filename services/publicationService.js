const Publication = require("../models/Publication");

async function getAll() {
    return Publication.find({}).lean();
};

async function getById(id) {
    return Publication.findById(id).populate('author').lean();
};

async function getByIdNoLean(id) {
    return Publication.findById(id);
};

async function deleteById(id) {
    return Publication.findByIdAndDelete(id);
};

async function update(publication, data) {
    publication.title = data.title;
    publication.tech = data.tech;
    publication.picture = data.picture;
    publication.certificate = data.certificate;
    return publication.save();
};

async function create(publication) {
    return Publication.create(publication);
};

async function share(publication, userId) {
    publication.users.push(userId);
    publication.usersCount++;
    return publication.save();
};

module.exports = { getAll, getById, getByIdNoLean, deleteById, update, create, share };