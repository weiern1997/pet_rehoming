var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const User = require('../models/users')

//---------------------GET------------------
router.get('/', isAdmin, (req, res) => {
	User.find({}, null, { sort: "-admin" }, (err, result) => {
		if (err) res.sendStatus(500)
		res.status(200).send(result)
	})
})

//-------------------POST---------------------
router.put('/edit', (req, res) => {
	//////////////////////
	//only fields you want to edit
	//name:
	//email:
	//company:
	//////////////////////
	User.findOneAndUpdate({ "username": req.body.username }, (req.body), { new: true, useFindAndModify: false }, (err, result) => {
		if (err) res.sendStatus(500)
		jwt.sign({ name: result['name'], username: result['username'], company: result['company'], email: result['email'], admin: result['admin'] },
			secretkey, { expiresIn: '24h' }, (err, token) => {
				if (err) console.log(err)
				res.status(200).json({
					token: token
				})
			});
	})
})
router.post('/delete', isAdmin, (req, res) => {
	/////////////////////
	//username: 
	/////////////////////
	User.deleteOne({ username: req.body.user }, (err) => {
		if (err) res.sendStatus(500)
	})
	res.sendStatus(200)
})

router.put('/change_pass', (req, res) => {
	//////////////////////
	//old:
	//new:
	//confirm:
	//////////////////////
	let { 'old': old,
		'new': new_pw,
		'confirm': confirm } = req.body;
	User.findOne({ "username": req.body.username }, (err, user) => {
		if (err) res.sendStatus(500)
		bcrypt.compare(old, user['password']).then(function (result) {
			//wrong password
			if (result != true) return res.json({ message: "Wrong password" })
			if (!schema.validate(new_pw)) return res.json({message: "Requirements not met"})
			if (new_pw != confirm) return res.json({message: "Passwords don't match"})
			var saltRounds = 12;
			//hashing functions
			bcrypt.hash(new_pw, saltRounds, function (err, hash) {
				User.updateOne(user, { "password": hash }, (err, done) => {
					if (err) res.sendStatus(500)
				})
				res.sendStatus(200)
			})
		});
	})
})

router.post('/register', isAdmin, (req, res) => {
	//Self explanatory
	let { 'name': name,
    'email': email,
    'company': company,
    'username': username,
    'password': password,
	'admin': is_admin,
	'access': access
  } = req.body
	User.findOne({ "username": username }, (err, result) => {
		if (err) return res.sendStatus(500)
		if (result != null) return res.status(500).send({error: "User taken"})
		var saltRounds = 12;
		bcrypt.hash(password, saltRounds, function (err, hash) {
			if (err) return res.sendStatus(500)
			var newUser = new User({ name: name, email: email, company: company, 
				username: username, password: hash, access: access,admin: is_admin })
			newUser.save(function (err) {
				if (err) return res.sendStatus(500)
				res.sendStatus(200)
			})
		})
	})
})

var secretkey = process.env.SECRET_KEY;
function isAdmin(req, res, next) {
	// Gather the jwt access token from the request header
	const token = req.headers['authorization']
	if (token == null) return res.sendStatus(401) // if there isn't any token

	jwt.verify(token, secretkey, (err, authdata) => {
		if (err || !authdata.admin) return res.sendStatus(403)
		next() // pass the execution off to whatever request the client intended
	})
}

module.exports = router;