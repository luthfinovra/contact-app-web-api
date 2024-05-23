const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: String,
    phoneNumber: Number,
    email: String,
    other: {
        linkedIn: String,
        instagram: String,
        twitter: String,
    } 
});

module.exports = mongoose.model('Contact', ContactSchema);