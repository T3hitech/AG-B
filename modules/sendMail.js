var nodemailer = require('nodemailer');
require('dotenv').config();
const { validation } = require('../utils/validation');

var transporter = nodemailer.createTransport({
  secure: true,
  host: process.env.SMTPHOST,
  port: process.env.SMTPPORT,
  auth: {
    user: process.env.SMTPUSER,
    pass: process.env.SMTPPW
  }
});

var mailOptions = {
  from: process.env.SMTPUSER,
  to: '',
  subject: 'Email From Node.js',
  // text: 'test mail easy!',
  html: ''
};

const sendMail = (user) => {
  return new Promise((resolve, reject) => {
    const htmlTemplate = `
        <h3>Password Recovery Request</h3>
        <h4>Hello ${user.USERNAME}(${user.EMAIL}),</h4>
        <p>We received a request to reset your password. If you did not request a
        password recovery, please ignore this email.</p>

        <span>Here is your password: <h3>${Buffer.from(user.PASSCODE, 'base64').toString('ascii')}</h3></span>
        
        <h5>Thanks,</h5>
        <h6>Algeria Quest Support Team</h6>
        `;


    mailOptions.to = user.EMAIL;
    mailOptions.html = htmlTemplate;
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        let errors = {};
        errors.error = err.message;
        reject(validation(errors));
      } else {
        let sentTo = info.accepted[0];
        resolve(validation(sentTo));
      }
    });
  })
}

module.exports = { sendMail };