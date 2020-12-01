var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'zoho',
  host: 'smtp.zoho.com',
  port: 587,
  secure: false,
  auth: {
    user: 'anil.ahuja@staticcodes.io',
    pass: 'anilE075555ahuja',
  }
});

export default class EmailController {

  sendMail = function (email: any, message: any) {
    var mailOptions = {
      from: 'anil.ahuja@staticcodes.io',
      to: email,
      subject: 'Email verification',
      text: message
    };

    transporter.sendMail(mailOptions, function (error: any, info: any) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }
}

export const emailController = new EmailController();


