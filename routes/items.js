var express = require('express');
var router = express.Router();
var axios = require('axios');



router.get('/bd', (req, res) => {
  axios.get('/api/items/get_items', { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      res.render('items_bd', { title: 'Farm Inventory', user: req.user, products: response.data });
    })
    .catch((error) => {
      if (error.response.status == 403) {
        res.redirect('/relogin')
      }
      else {
        res.redirect('/500')
      }
    })
})

router.delete('/delete_sku', (req, res) => {
  axios.delete('/api/items/delete_sku', { data: req.body }, { headers: { 'authorization': req.session.passport.user } })
    .then(response => {
      res.sendStatus(200)
    })
    .catch((error) => {
      if (error.response.status == 403) {
        res.sendStatus(403)
      }
      else {
        res.sendStatus(500)
      }
    })
})



module.exports = router;
