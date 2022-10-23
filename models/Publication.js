const { Schema, model, Types } = require('mongoose');

const YESNO_PATTERN = /^(?:Yes|No)$/i;

const publicationSchema = new Schema({
    title: { type: String, required: true },
    tech: { type: String, required: true },
    picture: { type: String, required: true },
    certificate: { type: String, required: true, match: [YESNO_PATTERN, 'Certificate can only be "yes" or "no"'] },
    author: { type: Types.ObjectId, ref: 'User' },
    shares: { type: [Types.ObjectId], ref: 'User', default: [] },
    sharesCount: { type: Number, default: 0 }
});

const Publication = model('Publication', publicationSchema);
module.exports = Publication;

