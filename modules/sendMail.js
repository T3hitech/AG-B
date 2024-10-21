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
        <h4>Dear ${user.username}(${user.email}),</h4>
        <p>We have received the request from you (${user.username}) for registering into the website of Alergia-Quest.com.</p>
        <p>Thanks for showing interesting to subscribe. To activate your email id to receive more information, please click below button.</p>
    
        <a href="http://localhost:3000/verify/search?search=${Buffer.from(user.username).toString('base64')}" class="rbl">Activate here</a>
    `;
    mailOptions.to = user.email;
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