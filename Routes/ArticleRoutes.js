var express  = require('express');
var router = express.Router();
let Article = require('../Models/article.model');
var User = require('../Models/user.model');
var sendgrid = require('../Sendgrid/SendgridFunctions')
var PrettyUrl = require('../Utils/PrettyUrl')

const roles = {
    'user': { can: [] },
    'admin': { can: ['read', 'write'] },
}


//Get All Articles
router.route('/').get(function(req, res) {
    const descSort = {'createdAt': +1}
    Article.find({isDraft: false})
    .populate('author', 'email username')
    .sort(descSort)
    .exec(function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.json(articles);
        }
    })
});
//Get one Article
router.route('/:slug').get(function(req, res) {
  console.log("rquesting " + req.params.slug)
  console.log(req.session.userId)

  User.findById(req.session.userId) //('5d6b5c2b03f7d5532543ba90')
    .exec(function (error, user) {
      if (error) {
        return res.status(400).send("Not logged in");
      } else {
        if (user === null) {
          return res.status(401).send("Not authorized. UserSession: " + req.session);
        } else {
          let slug = encodeURIComponent(req.params.slug);
          console.log("received " + req.params.slug + " As slug")
          console.log("tryign to find article: " + slug)
          Article.findOne({ slug: slug })
          .populate('author', 'email username')
          .exec(function (err, article) {
            //console.log(slug)
            if (err || !article) {
                console.log(err + 'Could not find article');
                res.status(404).send("Could not find article")
            } else {
                console.log("heres your article")
                //console.log(article)
                res.json(article);
            }
          })
        }
      }
    });
});
//Get one Draft Article
router.route('/draft/:slug').get(function(req, res) {
  console.log("rquesting " + req.params.slug)
  console.log(req.session.userId)

  User.findById(req.session.userId) //('5d6b5c2b03f7d5532543ba90')
    .exec(function (error, user) {
      if (error) {
        return res.status(400).send("Not logged in");
      } else {
        if (user === null) {
          return res.status(401).send("Not authorized. UserSession: " + req.session);
        } else {
          let slug = encodeURIComponent(req.params.slug);
          Article.findOne({ slug: slug, draft: true })
          populate('author', 'email username')
          .exec(function (err, article) {
            //console.log(slug)
            if (err || !article) {
                console.log(err + 'Could not find article');
                res.status(404).send("Could not find article")
            } else {
                console.log("heres your article")
                //console.log(article)
                res.json(article);
            }
          })
        }
      }
    });
});

//Post an Article
router.route('/add').post(function(req, res) {
  let slug = encodeURIComponent(req.body.title)
  let userList = User.getEmails()
  // console.log("str8 function call: " + User.getEmails)
  // console.log("trying to create " + slug)
  Article.findOne({ slug: slug }, function (err, article) {

    if (article) {
      console.log("error, aritcle exists")
      res.status(409).send("Article name already exists")
    } else {
        //console.log(err + 'Could not find article');

        console.log("no article with that title found")
        let article = new Article(req.body)

        article.save()
            .then(article => {
              let aurl = `https://aotd.herokuapp.com/article/${slug}`
                //console.log("sending a req to sendgrid with " + PrettyUrl(article.title))
                Article.newArticle(PrettyUrl(article.title), aurl, userList)
                res.status(200).json(
                  {
                    'article': 'article added successfully',
                    'body': article
                });
            })
            .catch(err => {
                res.status(400).json(err);
                console.log(err)
                console.log("received request: ")
                console.log(req.body)
                //console.log(article)
            });
    }
  })

});
//Add comments to an article
router.route('/:slug/comments').post(function(req, res) {
    let slug = encodeURIComponent(req.params.slug);
    let aurl = `https://aotd.herokuapp.com/article/${slug}`
    let id = req.params.id;
    let whoCommented = "No User"
    User.findById(req.session.userId, function (error, user) {
      if (error || !user) {
        res.status(400).send('Not logged in');
      } else {
        whoCommented = user.username
      }
    })
    //console.log("comments atempt")
    //console.log(slug)
    if (req.body.body) {
      Article.findOne({ slug: slug })
      .populate('author', 'email username')
      .exec(function (err, article) {
          let authorEmail = article.author.email//User.getEmails(article.author)
          if (!article)
              res.status(404).send("Article not found");
          else
              article.comments.push(req.body)
              console.log("Did we get email: " + authorEmail)
              if (authorEmail != null){
                sendgrid.sendCommentUpdate(authorEmail, article, aurl, whoCommented)
              }
              article.save().then(article => {
                  res.json('Comments added to ' + article.title);
              })
              .catch(err => {
                  res.status(400).send("Update not possible");
              });
      });
    } else {
      var err = new Error('Body field required.');
      err.status = 400;
      return next(err);
    }

});

//delte and article by slug
router.route('/delete/:slug').post(function(req, res) {
  let slug = encodeURIComponent(req.params.slug);
  User.findById(req.session.userId, function (error, user) {
    if (error || !user) {
      res.status(400).send('Not logged in');
    } else {
      req.session.userId = user._id;
      const operation = 'read';
      console.log(user.role)
      if (
          !roles[user.role] ||
          roles[user.role].can.indexOf(operation) === -1
      ) {
          // early return if the access control check fails
          return res.status(404).send(user.username + " is a " + user.role + '. Access Denied, not an Admin'); // or an "access denied" page NOT admin
      } else {
        Article.deleteOne({ slug: slug }, function (err, article) {
          //console.log(slug)
          if (err) {
              console.log(err + 'Could not delete article');
          } else {
              console.log(article.title + " deleted")
              res.status(200).send(slug + ' deleted');
          }
        })
      }
    }
  });
});
//delelet all articles
router.route('/delete/all/all').post(function(req, res) {

  User.findById(req.session.userId, function (error, user) {
    if (error || !user) {
      res.status(400).send('Not logged in');
    } else {
      req.session.userId = user._id;
      const operation = 'read';
      console.log(user.role)
      if (
          !roles[user.role] ||
          roles[user.role].can.indexOf(operation) === -1
      ) {
          // early return if the access control check fails
          return res.status(404).send(user.username + " is a " + user.role + '. Access Denied, not an Admin'); // or an "access denied" page NOT admin
      } else {
        Article.remove({ }, function (err) {
          //console.log(slug)
          if (err) {
              console.log(err + 'Could not delete articles');
          } else {
              console.log("all articles deleted")
              res.status(200).send('all articles deleted');
          }
        })
      }
    }
  });
});

//delte and article by id
router.route('/delete/id/:id').post(function(req, res) {
  let id = req.params.id;
  User.findById(req.session.userId, function (error, user) {
    if (error || !user) {
      res.status(400).send('Not logged in');
    } else {
      req.session.userId = user._id;
      const operation = 'read';
      console.log(user.role)
      if (
          !roles[user.role] ||
          roles[user.role].can.indexOf(operation) === -1
      ) {
          // early return if the access control check fails
          return res.status(404).send(user.username + " is a " + user.role + '. Access Denied, not an Admin'); // or an "access denied" page NOT admin
      } else {
        Article.deleteOne({ _id: id }, function (err, article) {
          //console.log(slug)
          if (err) {
              console.log(err + 'Could not delete article');
          } else {
              console.log(article.title + " deleted")
              res.status(200).send(id + ' deleted');
          }
        })
      }
    }
  });
});

module.exports = router;
