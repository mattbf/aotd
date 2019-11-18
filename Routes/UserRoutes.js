var express = require('express');
var router = express.Router();
var User = require('../Models/user.model');
let Article = require('../Models/article.model');
const SESS_NAME=process.env.SESS_NAME

// // Don't need to display
// router.get('/', function (req, res, next) {
//   return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
// });

const roles = {
    'user': { can: [] },
    'admin': { can: ['read', 'write'] },
}


//POST route for updating data
router.post('/', function (req, res, next) {

  if (req.body.email &&
    req.body.username &&
    req.body.password) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    }

    console.log(userData)
    //remove

    User.create(userData, function (error, user) {
      if (error) {
        if (error.code === 11000) {
          // email or username could violate the unique index. we need to find out which field it was.
          let message = "duplicate error"
          console.log("Unique index error")
          let field = error.message.split(" ")[7];
          field = field.split('_')[0]
          if (field == 'email') {
            message = "This user already exists"
          } else {
            message = "username is taken"
          }
          console.log("Username taken")
          return res.status(400).send({
            'message': message,
            'value': field
          });
        }
        return next(error);
      } else {

        req.session.userId = user._id;
        return res.status(200).json({
          'username': user.username,
          'email': user.email,
          'role': user.role,
          'createdAt': user.createdAt,
        });
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        console.log("Wrong email or password")
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        console.log(user.username + " logged in Session: " + req.session.userId)
        console.log("user session created: ")
        console.log(req.session)
        //return res.status(200).send(user.username + ' logged in successfully');
        return res.status(200).json({
          'username': user.username,
          'email': user.email,
          'role': user.role,
          'createdAt': user.createdAt,
        }); // pass logemail to log back in
      }
    });
  } else {
    console.log("all fields required")
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

//Check if logged in
router.get('/auth', function (req, res, next) {
  console.log(req.session)
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          // console.log('User==null ' + req.session.userId)
          // console.log(user)
          var err = new Error('Not authorized! Go back!');
          err.status = 405; //Chnaged to 405 for debugging
          return next(err);
        } else {
          return res.json({
            '_id': user._id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'createdAt': user.createdAt,
          });
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        //console.log(req.session + ' logged out')
        res.clearCookie(SESS_NAME);
        return res.status(200).send(req.session + ' logged out');
      }
    });
  }
});

//Updateing User bio
router.post('/:username/update', function(req, res) {
  let username = req.params.username;
  console.log(req.body)
  console.log(req.params.username)
  if (req.body.bio) {
    User.findOne({ username: username }, function (err, user){
      if (err) {
        res.status(404).send("User not found");
      } else {
        console.log(user.bio)
        user.bio = req.body.bio;
        user.save().then(user => {
            res.json('User bio Update' + user);
        })
      }
    });
  } else {
    res.status(400).send("Need valid bio object");
  }

})

//GET user profile
router.get('/:username', function (req, res, next) {
  //console.log(req.session)

  let profile = req.params.username;
  console.log("trying to view " + profile)
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          User.find({username: profile}, function(err, userProfile) {
            console.log(userProfile)

            Article.find({author: userProfile }, function(err, authorArticles) {
                if (err) {
                    console.log(err);
                    var err = new Error("error getting user articles");
                    err.status = 400;
                    return next(err);
                } else {
                  // return res.json({
                  //   'articles': authorArticles
                  // })
                  let draftArticles = authorArticles.filter(function(article) {
                     return article.isDraft != false || null;
                    //return article.author == "alldacomments"
                  });
                  let published = authorArticles.filter(function(article) {
                     return article.isDraft == false || null;
                    //return article.author == "alldacomments"
                  });

                  if (userProfile[0]) {
                    Article.find({'comments.author': profile}, function(err, articleWithComments) {
                        if (err) {
                            console.log(err);
                        } else {
                          //console.log(articleWithComments[0].comments)
                          var count = 0
                          articleWithComments.forEach(article => article.comments.forEach(comment => {
                            if (comment.author == profile){
                              count += 1
                            }
                          }))
                          //console.log(count)
                          //comments.forEach(comment => console.log(comment.author))
                          return res.json({
                            'profile': {
                              'username': userProfile[0].username,
                              'role': userProfile[0].role,
                              'email': userProfile[0].email,
                              'createdAt': userProfile[0].createdAt,
                              'bio': userProfile[0].bio
                            },
                            'articles': published,
                            'drafts': draftArticles,
                            'comments': count//comments.count()
                          })
                        }
                    })

                  } else {
                    var err = new Error("Couldn't find that user");
                    err.status = 404;
                    return next(err);
                  }

                }
            })


        })
    }}})
});
//User.find({name:'vlad','links.url':req.params.query}

// delete all UserS
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
        User.remove({ }, function (err) {
          //console.log(slug)
          if (err) {
              console.log(err + 'Could not delete users');
          } else {
              console.log("all user deleted")
              res.status(200).send('all users deleted');
          }
        })
      }
    }
  });
});

// DANGER DELET ALL UserS
router.post('/deleteall', function(req, res) {
  User.deleteMany({}, function (err) {
    if(err) console.log(err);
    console.log("Successful deletion");
  });
})



module.exports = router;
