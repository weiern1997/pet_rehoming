var express = require('express');
var router = express.Router();
var moment = require('moment');
var axios = require('axios');

const User = require('../models/users')


//--------------------GET--------------
router.get('/home', (req, res) => {
  res.status(200).json({msg: 'Welcome to the home page'});
})

router.get('/users', (req, res) => {
  if (req.user.admin) {
    User.find({}, (err, users) => {
      if (err) {
        res.redirect('/500');
      } else {
        res.render('users', { title: 'User List', user: req.user, users: users });
      }
    })
  }
  else {
    res.sendStatus(403);
  }
})

router.get('/users/register', (req, res) => {
  if (req.user.admin) {
    res.render('register', { title: 'Register' });
  }
  else {
    res.sendStatus(403);
  }
})

router.get('/profile', (req, res) => {
  res.render('profile', { title: 'Profile', user: req.user });
})

router.get('/users/change_pass', (req, res) => {
  res.render('change-password', { title: "Change Passsword" })
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


//------------------------POST-----------------------------
router.post('/user/edit', (req, res) => {
  var updates = {}
  updates['username'] = req.user.username
  for (var key in req.body) {
    if (req.body[key]) {
      updates[key] = req.body[key]
    }
  }
  axios.put('/api/user/edit', updates, {headers: {'authorization': req.session.passport.user}})
  .then((response) =>{
    if(response.status == 200){
      req.session.passport.user = response.data.token
      res.redirect('/profile')
    }
  })
  .catch((error) => {
    console.log(error)
    if (error.response.status == 403) {
      res.redirect('/relogin')
    }
    else {
      res.redirect('/500')
    }
  })
})

router.post('/users/delete', (req, res) => {
  axios.post('/api/user/delete', req.body, {headers: {'authorization': req.session.passport.user}})
  .then((response) => {
    if(response.status == 200){
      res.redirect('/users')
    }
  })
  .catch((error) => {
    console.log(error)
    if (error.response.status == 403) {
      res.redirect('/relogin')
    }
    else {
      res.redirect('/500')
    }
  })
})

router.post('/users/change_pass', (req, res) => {
  req.body['username'] = req.user.username
  axios.put('/api/user/change_pass', req.body,{headers: {'authorization': req.session.passport.user}})
  .then((response)=>{
    if (typeof response.data == 'object'){
      res.render('change-password', { title: "Change Passsword", message: response.data.message})
    }
    else{
      res.redirect('/home')
    }
  })
  .catch(error => {
    console.log(error)
  })
})

router.post('/users/register', (req, res) => {
  if (!req.user.admin) res.render('register', { message: "Must be admin", messageClass: 'alert-danger', title: 'Register' });
  axios.post('/api/user/register', req.body,{headers: {'authorization': req.session.passport.user}})
  .then((response)=>{
    res.sendStatus(200)
  })
  .catch(error => {
    if(error.response.data != null) return res.send(error.response.data)
    res.sendStatus(500)
  })
})


module.exports = router;
