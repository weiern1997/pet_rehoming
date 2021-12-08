var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require('path');

const Pet = require('../models/pets');
const Adoption = require('../models/adoptions');

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
  Pet.find({adopted: false}, function(err, pets) {
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

//Create a new pet and render new page
router.get('/new', function(req, res, next) {
  res.render('new', {title: 'New Pet', user: req.user});
});

//get a single pet and render show page
router.get('/:id', function(req, res, next) {
  Pet.findById(req.params.id, function(err, pet) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', {
        pet: pet,
        title: pet.name,
        user: req.user
      });
    }
  });
});




//Create a new pet and redirect to pets page
router.post('/new', upload.single('image'), function(req, res, next) {
  let pet = req.body
  //Loop through pet object and convert yes/no to boolean
  for (var key in pet) {
    if (pet[key] === 'Yes') {
      pet[key] = true;
    } else if (pet[key] === 'No') {
      pet[key] = false;
    }
  }
  pet["img"] = {data: fs.readFileSync(path.join(__dirname, '../uploads/' + req.file.filename)),
                 contentType: 'image/png'}
  pet.adopted = false;
  Pet.create(pet, function(err, pet) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/pets');
    }
  });
});

//Edit a pet and redirect to show page
router.get('/:id/edit', function(req, res, next) {
  Pet.findById(req.params.id, function(err, pet) {
    if (err) {
      console.log(err);
    } else {
      res.render('edit', {
        pet: pet,
        title: pet.name,
        user: req.user
      });
    }
  });
});


//Change adoption status to true and create adoption record and redirect to show page
router.get('/:id/adopt', function(req, res, next) {
  Pet.findById(req.params.id, function(err, pet) {
    if (err) {
      console.log(err);
    } else {
      pet.adopted = true;
      pet.save();
      res.redirect('/pets/' + pet._id);
    }
  });

  //Create adoption record
  let adoption = {
    pet: req.params.id,
    status: "adopted",
    owner_id: req.user._id
  }
  Adoption.create(adoption, function(err, adoption) {
    if (err) {
      console.log(err);
    } else {
      console.log(adoption);
    }
  });
});

//Delete a pet
router.post('/:id/delete', function(req, res, next) {
  Pet.findByIdAndRemove(req.params.id, function(err, pet) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/pets');
    }
  });
});




module.exports = router;