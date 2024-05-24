const User = require('../models/user');

module.exports.getContacts = async (userId) => {
    try {
        const user = await User.findById(userId).populate('contact');
        return user.contact;
    } catch (error) {
        throw new Error('Failed to fetch contacts');
    }
};