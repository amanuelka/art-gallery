const { Schema, model, Types } = require('mongoose');

const URL_PATTERN = /^(?:Yes|No)$/i;

const publicationSchema = new Schema({
    title: { type: String, required: true },
    tech: { type: String, required: true },
    picture: { type: String, required: true },
    certificate: {
        type: String,
        required: true,
        validate: {
            validator: (value) => URL_PATTERN.test(value),
            message: 'Certificate can only be "yes" or "no"'
        }
    },
    author: { type: Types.ObjectId, ref: 'User' },
    users: { type: [Types.ObjectId], ref: 'User', default: [] },
    usersCount: { type: Number, default: 0 }
});

const Publication = model('Publication', publicationSchema);
module.exports = Publication;

