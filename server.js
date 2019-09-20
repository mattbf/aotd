const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path")
//import { PORT, NODE_ENV, SESS_NAME, SESS_SECRET, SESS_LIFETIME } from './config'  //require('./config');
//const serverConfig = require('./config')
const dotenv = require('dotenv');
require('dotenv').config();
//var PORT = serverConfig.PORT
const APP_DOMAIN = process.env.APP_DOMAIN
const PORT = process.env.PORT || 4000;
const SESS_LIFETIME = process.env.SESS_LIFETIME || 1000 * 60 * 60 * 24 * 14 //14 days in milliseconds
const NODE_ENV=process.env.NODE_ENV
const SESS_NAME=process.env.SESS_NAME //|| "localsession"
const SESS_SECRET=process.env.SESS_SECRET || "secretphraseLocal"

console.log(NODE_ENV === 'production')

var articleRouter = require('./Routes/ArticleRoutes');
var userRouter = require('./Routes/UserRoutes')
var adminRouter = require('./Routes/AdminRoutes')


//user session pakckages
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


app.disable('x-powered-by');
//app.use(cors());
app.use(bodyParser.json());
//express.session({cookie: { domain: '.app.localhost', maxAge: 24 * 60 * 60 * 1000 }})


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", APP_DOMAIN);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
const corsConfig = {
    origin: ['http://localhost:3000', 'https://aotd.herokuapp.com', 'http://localhost:4000' ],
    methods:['GET','POST'],
    credentials: true,
};
app.use(cors(corsConfig));

mongoose.connect(process.env.MONGODB_URI ||'mongodb://127.0.0.1:27017/articles', { useNewUrlParser: true });

var db = mongoose.connection;
db.once('open', function() {
    console.log("MongoDB database connection established successfully");
})


var sess = {
      name: SESS_NAME,
      secret: SESS_SECRET,
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({
        mongooseConnection: db,
        collection: 'session',
        ttl: parseInt(SESS_LIFETIME) /// 1000 //mongoose takes it in seconds
      }),
      cookie: {
        sameSite: true,
        httpOnly: true, //NODE_ENV === 'production' ? true : false, //effects sending cookie
        path: '/',
        domain: 'https://aotd.herokuapp.com', //|| '127.0.0.1', // change APP_DOMAIN
        secure: false, //NODE_ENV === 'production', //Effects on reload
        maxAge: parseInt(SESS_LIFETIME) // 1000
      }
    }

if (NODE_ENV === 'production') {
  app.set('trust proxy', true) // trust first proxy
  //sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))

app.use('/articles', articleRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);


//Connent backend to frontend
app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// if (NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static(path.join(__dirname, "client", "build")))
//
//   app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "build", "index.html"));
//   });
// }

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
