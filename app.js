var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var mongoose = require('mongoose');
var crypto = require('crypto');
var flash = require('connect-flash-plus');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var rateLimit = require("express-rate-limit");
var axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
var bcrypt = require('bcrypt');



//-----------------database set up-------------
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("db connected!")
});
//--------------end database set up------------------

//--------------------functions-----------

//generate secret key for sessions
const generateSec = () => {
  return crypto.randomBytes(34).toString('hex');
}

//middleware to ensure authentication
var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect('/login')
}
//ratelimit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 //20 times per 15 min window
});


//-------------------end functions-------------




//-------------app set up ------------------
const { default: Axios } = require('axios');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(flash());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public'),{
                        index: false,
                        immutable: true,
                      cacheControl: true}));
app.use(session({ secret: generateSec(), saveUninitialized: true, resave: false, rolling: true, cookie: { maxAge: 28800000 } }))
app.use(passport.initialize());
app.use(passport.session());

//-----------------end express set up--------------------


//--------------Passport set up--------------------
const User = require('./models/users')

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      } 
      bcrypt.compare(password, user['password']).then(function (result) {
        // result == true
        if (result == true) {
          return done(null, user);
        }
        else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      });
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
//------------------end passport set up-------------


//---------------------Routes-------------
var loginRouter = require('./routes/login');
var indexRouter = require('./routes/index');
var orderRouter = require('./routes/orders')
var itemRouter = require('./routes/items')

//------------log in route-----------
app.use('/', loginRouter);

//--------protected routes--------
app.use(ensureAuthenticated);

app.use('/', indexRouter);
app.use('/orders', orderRouter);
app.use('/items', itemRouter);


//-----------catch 404----------------
app.get('*', (req, res) => {
  res.redirect('/404');
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err.message);
  res.status(err.status || 500);
  res.send(err.message);
});


app.listen(3000, () => {
  console.log("server started!");
})



