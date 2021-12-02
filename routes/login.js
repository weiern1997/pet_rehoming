var express = require('express');
var router = express.Router();
var passport = require('passport');



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



router.post('/login',
  passport.authenticate('local', ({
    successRedirect: '/',
    failureRedirect: '/login?retry',
    failureFlash: true})
  )
)







module.exports = router;
