var express  = require('express');
var router = express.Router();
let Article = require('../Models/article.model');
var User = require('../Models/user.model');


const roles = {
    'user': { can: [] },
    'admin': { can: ['read', 'write'] },
}


//Get All Articles
router.route('/').get(function(req, res) {
    Article.find(function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.json(articles);
        }
    });
});
//Get one Article
router.route('/:slug').get(function(req, res) {
  console.log("rquesting " + req.params.slug)
  //console.log(req.session)

  User.findById(req.session.userId) //('5d6b5c2b03f7d5532543ba90')
    .exec(function (error, user) {
      if (error) {
        return res.status(400).send("Not logged in");
      } else {
        if (user === null) {
          return res.status(401).send("Not authorized!");
        } else {
          let slug = req.params.slug;
          Article.findOne({ slug: slug }, function (err, article) {
            console.log(slug)
            if (err) {
                console.log(err + 'Could not find article');
                res.status(400).send("Could not find article")
            } else {
                console.log("heres your article")
                console.log(article)
                res.json(article);
            }
          })
        }
      }
    });
});
//delte and article by slug
router.route('/delete/:slug').post(function(req, res) {
  let slug = req.params.slug;
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
//Post an Article
router.route('/add').post(function(req, res) {
    let article = new Article(req.body);
    article.save()
        .then(article => {
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
});
//Add comments to an article
router.route('/:slug/comments').post(function(req, res) {
    let slug = req.params.slug;
    console.log(slug)
    if (req.body.body) {
      Article.findOne({ slug: slug }, function (err, article) {
          if (!article)
              res.status(404).send("Article not found");
          else
              article.comments.push(req.body)
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

module.exports = router;
