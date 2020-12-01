import mongoose from 'mongoose';

let MailSchema = new mongoose.Schema({
    to:{
        type: String,
    },
    from:{
        type: String
    },
    subject: {
        type: String
    },
    message:{
        type: String,
    },
    mailId:{
        type: String
    }
});

var Mail = mongoose.model('Mail', MailSchema);
module.exports = Mail;