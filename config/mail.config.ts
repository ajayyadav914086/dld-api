const nodemailer = require("nodemailer");
const MailData = require('../models/mail.model');

// async..await is not allowed in global scope, must use a wrapper
export default class Mail {
    static async adminMail(to: any, subject: any, message: any) {
        let transporter = nodemailer.createTransport({
            host: "smtp.zoho.in",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'admin@bauktion.com', // generated ethereal user
                pass: '1inNpGrQY3mj', // generated ethereal password
            },
        });
        this.sendMail(transporter, 'admin@bauktion.com', to, subject, message)
    }

    static async sendMail(transporter: any, from: any, to: any, subject: any, message: any) {
        let info = await transporter.sendMail({
            from: '"Bauktion" <' + from + '>',
            to: to,
            subject: subject,
            html: message, // html body
        });
        const mailData = {
            'to': to,
            'from': from,
            'subject': subject,
            'message': message,
            'mailId': info.messageId
        }
        MailData.create(mailData, function (error: any, mail: any) {
            if (error) {
                console.log(error);
            } else {
                console.log(mail);
            }
        });
    }
}