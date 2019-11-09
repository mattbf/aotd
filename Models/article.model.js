const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var sendgrid = require('../Sendgrid/SendgridFunctions')
//const PrettyUrl = require('./Utils/PrettyUrl');

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: Object,
        required: true,
    },
    createdAt: {
        type: Date, default: Date.now ,
    },
    comments: [
      { body: {type: String, required: true}, date: { type: Date, default: Date.now }, author: String }
    ],
    meta: {
      votes: Number,
    },
    slug: {
      type: String
    },
    isDraft: {
      type: Boolean, default: false
    },

});

ArticleSchema.statics.newArticle = function (title, url, userList) {
  let slug = encodeURIComponent(title)
  console.log("requesting " + slug + " from article schema")
  Article.findOne({ slug: slug })
    .populate('author', 'email username')
    .exec(function (err, article) {
      //console.log(slug)
      if (err || !article) {
          console.log(err + 'Could not find article');
      } else {
          console.log("heres your article")
          console.log(article.title + " by: " + article.author.username)

          sendgrid.sendNewArticle(article, url, userList)
    }
  })
}

var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article
