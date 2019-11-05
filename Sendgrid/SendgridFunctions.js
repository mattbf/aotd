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
  sendNewArticle: function (article, url, userList) {
    console.log("aritcle: " + article.title)
    console.log("url: " + url)
    console.log("emails: " + userList)
    sgMail.send({
      to: userList,
      from: 'articles@aotd.ca',
      subject: 'New Article: ' + article.title,
      templateId: 'd-a67a600310864e66aea10b0f2e119201',
      dynamic_template_data: {
        article: {
          author: article.author,
          title: article.title,
          url: url,
          cta: "Read Article"
        }
      },
    });
    console.log("following msg was sent: " + msg)
  },
  sendCommentUpdate: function (authorEmail, article, url, whoCommented) {
    console.log("attempting to send msg ")
    console.log("aritcle: " + article.title)
    console.log("url: " + url)
    console.log("emails: " + authorEmail)
    console.log("who commented: " + whoCommented)
    sgMail.send({
      to: authorEmail,
      from: 'articles@aotd.ca',
      subject: whoCommented + ' commented on your article ' + article.title,
      templateId: 'd-e95095aa24c74833bed79975da13099f',
      dynamic_template_data: {
        article: {
          author: article.author,
          title: article.title,
          url: url,
          whoCommented: whoCommented,
          cta: "Read Comments"
        }
      },
    });

  },
};

//
// {
//    "article":{
//          "author":"Ben",
//          "title":"Article Test Title",
//          "url":"aotd.herokuapp.com/article/tiny-meat-gang-making-%24%24%24",
//          "summary":"heres an example summary, hello "
//    }
// }
