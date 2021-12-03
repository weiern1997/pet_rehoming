var express = require('express');
var router = express.Router();
var moment = require('moment');
var axios = require('axios');

const User = require('../models/users')


//--------------------GET--------------
router.get('/home', (req, res) => {
  res.status(200).json({msg: 'Welcome to the home page'});
})


router.get('/profile', (req, res) => {
  res.render('profile', { title: 'Profile', user: req.user });
})


router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

router.get('/404', (req, res) => {
  res.render('404', { title: '404', user: req.user });
})

router.get('/500', (req, res) => {
  res.render('500', { title: '500', user: req.user });
})

router.get('/relogin', (req, res) => {
  res.render('relogin', { title: 'Session expired', user: req.user });
})



module.exports = router;
