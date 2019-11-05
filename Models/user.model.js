var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
    enum: ["user", "admin"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bio: {
    type: String,
    default: 'This is your user bio. Tell us about yourself, the most intriguing thing about you, and your topics of interest',
  }
});


//authenticate input against database
UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

UserSchema.statics.adminauth = function (email, password, callback) {
  const operation = 'read';
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return err
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return err
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          if (
              !roles[user.role] ||
              roles[user.role].can.indexOf(operation) === -1
          ) {
              // early return if the access control check fails
              return res.status(404).send('Access Denied, not an Admin'); // or an "access denied" page NOT admin
          } else {
              User.find(function(err, users) {
                if (err) {
                  console.log(err)
                } else {
                  return res.json(users) //success
                }
              })
          }
        } else {
          return err // password wrong
        }
      })
    });
    // req.user is set post authentication

}

//GET user emails
UserSchema.statics.getEmails = function (author) {
  var isAuthor = author ? "true" : "false"
  console.log("EMAILS REQ MADE with author=" + isAuthor + " author: " + author)
  let userList =[]
  if(author){
    console.log("author was provided")
    User.find({ username: author }, function(err, user) {
      if (user != null){
        user.map((user, index) => {
          console.log("found user " + user.email)
          userList.push(user.email)
        })
          if (userList.length != 0){
            console.log("final emails list: " + userList)
          }
        console.log("empty user list")
      } else {
        var err = new Error('No users');
        err.status = 400;
        return next(err);
      }
    })
  } else{
    console.log("author was not provided")
    User.find({}, function(err, users) {
      if (users != null){
        users.map((user, index) => {
          console.log("found user " + user.email)
          userList.push(user.email)
        })
        if (userList.length != 0){
          console.log("final emails list: " + userList)
        } else {
          console.log("empty user list")
        }
      } else {
        var err = new Error('No users');
        err.status = 400;
        return next(err);
      }
    })
  }

  return userList
}


var User = mongoose.model('User', UserSchema);
module.exports = User;
