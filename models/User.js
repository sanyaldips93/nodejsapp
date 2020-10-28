/// Imports
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Defining the schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Creating the model
const User = mongoose.model('User', userSchema);

module.exports = User;
