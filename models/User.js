const { Schema, model, Types } = require('mongoose');

// TODO add user properties and validation according to assignment
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, minlength: [4, 'Username must be at least 4 characters long'] },
    address: { type: String, required: true, maxlength: [20, 'Address cannot be longer than 20 characters'] },
    hashedPassword: { type: String, required: true },
    publications: { type: [Types.ObjectId], ref: 'Publication', default: [] },
    shares: { type: [Types.ObjectId], ref: 'Publication', default: [] }
});

userSchema.index({ username: 1, }, {
    collation: {
        locale: 'en',
        strength: 2
    }
});

const User = model('User', userSchema);
module.exports = User;