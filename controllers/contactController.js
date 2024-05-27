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
        req.flash('success', 'Kontak Berhasil Ditambahkan');
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

module.exports.deleteContactById = async (req, res) => {
    const kontakId = req.params.id;
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, {$pull: {contact: kontakId}});
    await Contact.findByIdAndDelete(kontakId);

    if(req.accepts('html')){
        req.flash('success', 'Berhasil Menghapus Kontak')
        res.redirect('/');
    }else if(req.accepts('json')){
        res.json({message: 'Kontak berhasil dihapus'})
    }
}

module.exports.renderEditContactForm = async (req, res) => {
    const kontakId = req.params.id;
    const kontak = await Contact.findById(kontakId);

    res.render('editKontakView', {kontak});
}

module.exports.editKontak = async (req, res) => {
    const kontakId = req.params.id;
    const kontak = req.body.kontak;

    try {
        existingContact = await Contact.findById(kontakId);
        
        if(!existingContact){
            return res.status(404).send('Kontak not found');
        }

        existingContact.firstName = kontak.firstName;
        existingContact.lastName = kontak.lastName;
        existingContact.phoneNumber = kontak.phoneNumber;
        existingContact.email = kontak.email;

        await existingContact.save();

        if(req.accepts('html')){
            req.flash('success', 'Berhasil Mengubah Kontak');
            res.redirect('/')
        }else if(req.accepts('json')){
            res.json({message: 'Kontak Berhasil diubah'});
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }

}