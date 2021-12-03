var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt');
var passwordValidator = require('password-validator');



//-----------------password validation--------------
var schema = new passwordValidator();
schema
  .is().min(8)                                    // Minimum length 8
  .is().max(20)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123', 'Archisen1', 'Password1']);
//-------------------end password---------------------


var User = require('../models/users');

/* GET login page */
router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  }
  else {
    res.redirect('/login');
  }
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/home');
  }
  else {
    if('retry' in req.query) return res.render('login', {title: 'Login', message : 'User name and password do not match'})
    res.render('login', { title: 'Login' });
  }
})


//sign up page for new User
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
})

//post request for signup
router.post('/register', (req, res) => {
  //Self explanatory
  let { 'name': name,
    'email': email,
    'username': username,
    'password': password,
  } = req.body
  User.findOne({ "username": username }, (err, result) => {
    if (err) return res.sendStatus(500)
    if (result != null) return res.status(500).send({ error: "Username taken" })
    var saltRounds = 12;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err)
        return res.sendStatus(500);
      var newUser = new User({
        name: name, email: email, username: username, password: hash, admin: false
      });
      newUser.save(function (err) {
        if (err)
          return res.sendStatus(500);
        res.sendStatus(200);
      });
    })
  })
})

router.post('/login',
  passport.authenticate('local', ({
    successRedirect: '/',
    failureRedirect: '/login?retry',
    failureFlash: true})
  )
)







module.exports = router;
