const User = require('../models/user');
const Contact = require('../models/contact');
const contactServices = require('../utils/services')

module.exports.createNewContact = async (req, res) => {
    const contact = new Contact(req.body.kontak);
    console.log(req.body);
    await contact.save();

    console.log(req.user)
    const user = await User.findById(req.user._id);
    user.contact.push(contact);
    await user.save();

    if (req.accepts('html')) {
        req.flash('success', 'Welcome back!');
        const redirectUrl = req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    } else if (req.accepts('json')) {
        res.json({ message: 'Kontak Berhasil Disimpan',  Kontak: contact.toJSON});
    }
}

module.exports.getAllContact = async (req, res) => {
    const contacts = await contactServices.getContacts(req.user._id);
    
    res.json({ message: 'Daftar Kontak',  contacts: contacts});
}