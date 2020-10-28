/// Imports
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Defining the schema
const tokenSchema = new Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 300
    }
});

// Creating the model
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
