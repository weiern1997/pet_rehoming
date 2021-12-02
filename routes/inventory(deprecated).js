// router.get('/inventory/farm', (req, res) => {
//   axios.get('/api/get_inventory', {headers: {'authorization': req.session.passport.user}})
//     .then((response) => {
//       res.render('inventory_farm', { title: 'Farm Inventory', user: req.user, products: response.data });
//     })
//     .catch((error) => {
//       console.log(error)
//       if (error.response.status == 403) {
//         res.redirect('/relogin')
//       }
//       else {
//         res.redirect('/500')
//       }
//     })
// })

// router.get('/inventory/farm', (req, res) => {
//   let curr = moment().add(7,'days');
//   SKU.find({quantity: {$ne: null}, quantity:{$gt : 0},expiry:{$gte: curr}},null, {sort:"-expiry"},  (err,result)=>{
//     if(err) console.log(err)
//     console.log(result)
//     res.render('inventory_farm', { title: 'Farm Inventory', user: req.user, products:result });
//   })
// })

router.get('/inventory/bd', (req, res) => {
    axios.get('/api/get_inventory', {headers: {'authorization': req.session.passport.user}})
      .then((response) => {
        res.render('inventory_bd', { title: 'Farm Inventory', user: req.user, products: response.data });
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
  
  // router.get('/inventory/test', (req, res) => {
  //   let curr = moment().add(7,'days');
  //   SKU.find({expiry:{$gte: curr}},null, {sort:"-expiry"},  (err,result)=>{
  //     if(err) console.log(err)
  //     res.render('inventory_test', { title: 'Farm Inventory', user: req.user, products:result });
  //   })
  // })

  router.post('/inventory/add', (req, res) => {
    axios.post('/api/inventory/add', req.body, {headers: {'authorization': req.session.passport.user}})
      .then((response) => {
        if (response.status == 200) {
          res.redirect('/inventory/farm')
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
  
  router.post('/inventory/withdraw', (req, res) => {
    axios.post('/api/inventory/withdraw', req.body, {headers: {'authorization': req.session.passport.user}})
      .then((response) => {
        if (response.status == 200) res.sendStatus(200)
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
  