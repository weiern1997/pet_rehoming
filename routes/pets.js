var express = require('express');
var router = express.Router();
var multer = require('multer');

const Pet = require('../models/pets');

//Multer
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });

//get all pets and render pets page
router.get('/', function(req, res, next) {  
  Pet.find(function(err, pets) {
    if (err) {
      console.log(err);
    } else {
      res.render('pets', {
        pets: pets,
        title: 'Pets',
        user: req.user
      });
    }
  });
});

//get a single pet and render show page
router.get('/:id', function(req, res, next) {
  Pet.findById(req.params.id, function(err, pet) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {
        pet: pet
      });
    }
  });
});

//Change adoption status to true
router.put('/:id', function(req, res, next) {
  Pet.findByIdAndUpdate(req.params.id, {adopted: true}, function(err, pet) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/pets');
    }
  });
});

//Create a new pet and render new page
router.get('/new', function(req, res, next) {
  res.render('new');
});

//Create a new pet and redirect to pets page
router.post('/new', function(req, res, next) {
  let pet = req.body
  pet["image"]["data"] = fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename))
  pet["image"]["contentType"] = 'image/jpg'
  Pet.create(req.body, function(err, pet) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/pets');
    }
  });
});


module.exports = router;