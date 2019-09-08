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
const SESS_LIFETIME = process.env.SESS_LIFETIME
const NODE_ENV=process.env.NODE_ENV
const SESS_NAME=process.env.SESS_NAME
const SESS_SECRET=process.env.SESS_SECRET || "secretphraseLocal"
console.log(NODE_ENV === 'production')

var articleRouter = require('./Routes/ArticleRoutes');
var userRouter = require('./Routes/UserRoutes')
var adminRouter = require('./Routes/AdminRoutes')


//user session pakckages
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


//app.use(cors());
app.use(bodyParser.json());
//express.session({cookie: { domain: '.app.localhost', maxAge: 24 * 60 * 60 * 1000 }})

//PLease make cookies work
app.set('trust proxy', 1)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
const corsConfig = {
    origin:['http://localhost:3000', 'https://aotd.herokuapp.com', 'http://localhost:4000' ],
    methods:['GET','POST'],
    credentials: true,
};

app.use(cors(corsConfig));
//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

mongoose.connect(process.env.MONGODB_URI ||'mongodb://127.0.0.1:27017/articles', { useNewUrlParser: true });

var db = mongoose.connection;
db.once('open', function() {
    console.log("MongoDB database connection established successfully");
})


app.use(session({
      name: SESS_NAME || "localsession",
      secret: SESS_SECRET || "localsessionsecret",
      saveUninitialized: false,
      resave: false,
      store: new MongoStore({
        mongooseConnection: db,
        collection: 'session',
        ttl: parseInt(SESS_LIFETIME) / 1000 || (60 * 60 * 48) / 1000
      }),
      cookie: {
        sameSite: true,
        path: '/',
        domain: APP_DOMAIN || 'localhost:4000',
        secure: false, //NODE_ENV === 'production',
        maxAge: parseInt(SESS_LIFETIME) || 60 * 60 * 48 //two days locally,
      }
    }));

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
