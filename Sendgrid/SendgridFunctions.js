const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'matthewbf8@gmail.com',
  from: 'anyname@example.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

module.exports = {
  sendNewArticle: function (article) {
    console.log("attempting to send a notification")
    sgMail.send({
      to: 'matthewbf8@gmail.com',
      from: 'articles@aotd.ca',
      subject: 'New Article: ' + article.title,
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });
    console.log("following msg was sent: " + msg)
  },
};
