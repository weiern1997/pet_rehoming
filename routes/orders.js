var express = require('express');
var router = express.Router();
var Client = require('../models/clients');
var axios = require('axios');
var { parseAsync } = require('json2csv');
var XLSX = require('xlsx');
var multer = require('multer')
var moment = require('moment')


var storage = multer.memoryStorage()
var upload = multer({ storage: storage })



router.get('/', (req, res) => {
  axios.get('/api/orders/get_orders', { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      //response is an array of order ojects
      unique_company = {}; company_list = [];
      for (i = 0; i < response.data.length; i++) {
        if (response.data[i].client.company in unique_company) continue;
        unique_company['response.data[i].client.company'] = 1;
        company_list.push(response.data[i].client.company)
      }
      company_list.sort();
      res.render('orders', { title: 'Orders', user: req.user, orders: response.data, company_list });
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

router.get('/history', (req, res) => {
  axios.get('/api/orders/get_orders?history', { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      //response is an array of order ojects
      unique_company = {}; company_list = [];
      for (i = 0; i < response.data.length; i++) {
        if (response.data[i].client.company in unique_company) continue;
        unique_company['response.data[i].client.company'] = 1;
        company_list.push(response.data[i].client.company)
      }
      company_list.sort();
      res.render('orders_history', { title: 'Order History', user: req.user, orders: response.data, company_list });
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

router.get('/invoice', (req, res) => {
  axios.get('/api/orders/get_invoice', { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      res.render('invoice', { title: 'Invoice', user: req.user, orders: response.data })
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

router.get('/add', (req, res) => {
  axios.get('/api/items/sku', { headers: { 'authorization': req.session.passport.user } })
    .then(response => {
      res.render('orders_add', { title: 'Add orders', user: req.user, sku: response.data })
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

router.get('/download', (req, res) => {
  let [startdate, endate] = req.query['range'].split(' - ');
  start = new Date(startdate).getTime();
  end = new Date(endate).getTime();
  axios.get('/api/orders/get_orders?start=' + start + '&end=' + end, { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      //specify fields that are required
      let fields = [{ value: 'client.company', label: 'Company' }, { value: 'client.outlet', label: 'Outlet' }, 'po_date', 'po_number', 'dn_number',
        'fulfilment_date', 'invoiced', 'delivery_date']
      let rows = response.data
      //Map for quick check of new items
      let SKUMap = {}
      //Unroll into individual key:value pair
      rows.forEach(function (row, index) {
        row['items'].forEach(function (item, index) {
          row[item['SKU']] = item['quantity']
          //Mark a map lmao
          SKUMap[item['SKU']] = 1
        })
      })
      //For each new item, push into fields to output csv
      Object.keys(SKUMap).forEach(function (newItem) {
        fields.push(newItem)
      })
      let opts = {
        fields, transforms: (item) => {
          item['po_date'] = moment(item['po_date']).format("D/M/YYYY");
          item['fulfilment_date'] = moment(item['fulfilment_date']).format("D/M/YYYY");
          item['delivery_date'] = moment(item['delivery_date']).format("D/M/YYYY");
          return item;
        }
      }
      parseAsync(response.data, opts)
        .then(csv => {
          res.attachment('orders.csv')
          res.status(200).send(csv)
        })
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


//------------------------POST-----------------------------
router.post('/add_orders_excel', upload.single('workbook'), (req, res) => {
  if (!XLSX.read(req.file.buffer)) return res.sendStatus(500)
  var workbook = XLSX.read(req.file.buffer)
  var first_sheet_name = workbook.SheetNames[0];
  var worksheet = workbook.Sheets[first_sheet_name];
  data = []
  headers = {}
  items = []
  //cell processing
  for (cell in worksheet) {
    if (cell[0] === '!') continue
    var tt = 0;
    for (var i = 0; i < cell.length; i++) {
      if (!isNaN(cell[i])) {
        tt = i;
        break;
      }
    };
    var col = cell.substring(0, tt);
    var row = parseInt(cell.substring(tt));
    if (row < 6) continue;
    value = worksheet[cell].w
    if (row == 6 && value) {
      headers[col] = value;
      continue;
    }
    if (!data[row]) data[row] = {};
    if (!items[row]) items[row] = {};
    if (col > 'G') {
      items[row][headers[col]] = value;
    } else {
      data[row][headers[col]] = value;
    }
  }
  //delete the first 7 empty rows
  for (i = 0; i < 7; i++) {
    data.shift()
    items.shift()
  }
  for (i = 0; i < data.length; i++) {
    if (data[i] === undefined) {
      data.splice(i, 1)
      items.splice(i, 1)
      i--
      continue;
    }
    data[i]['items'] = items[i]
  }
  res.send(data)
  // axios.post('/api/orders/add_excel', data, {headers: {'authorization': req.session.passport.user}})
  //   .then((response) => {
  //     if (response.status == 200) {
  //       console.log(response.data)
  //       Client.find({}, (err, result) => {
  //         if (err) console.log(err)
  //         else {
  //           res.render('orders', { title: 'Orders', user: req.user, orders: response.data, clients: result });

  //           res.render('orders', { title: 'Add orders', user: req.user, clients: result, message: response.data['success'] })
  //         }
  //       })
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //     if (error.response.status == 403) {
  //       res.redirect('/relogin')
  //     }
  //     else {
  //       res.redirect('/500')
  //     }
  //   })
})

router.post('/submit_objects', (req, res) => {
  axios.post('/api/orders/add_excel', data, { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      if (response.status == 200) {
        res.sendStatus(200)
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
router.post('/add_client', (req, res) => {
  let { "company": company_name,
    "outlet": outlet_name } = req.body;
  Client.findOne({ company: company_name }, (err, result) => {
    if (err) console.log(err)
    if (result != null) {
      Client.findOne({ company: company_name, outlet: outlet_name }, (err, result) => {
        if (err) console.log(err)
        else if (result == null) {
          Client.findOneAndUpdate({ company: company_name }, { $push: { outlet: outlet_name } }, { upsert: true, useFindAndModify: true }, (err, result) => {
            if (err) console.log(err)
            {
              res.redirect('/orders/add', { message: "Success!" })
            }
          })
        }
        else {
          res.redirect('/orders/add')
        }
      })

    }
    else {
      var newClient = new Client({ company: company_name, outlet: outlet_name });
      newClient.save(function (err) {
        if (err) console.log(err)
        res.redirect('/orders/add')
      })
    }
  })
})

router.post('/add', (req, res) => {
  axios.post('/api/orders/add', req.body, { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      if (response.status == 200) {
        confirmation = {"po": req.body.po_number,
                        "items": response.data}
        res.status(200).send(confirmation)
      }
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

router.post('/edit', (req, res) => {
  var input = {}
  Object.keys(req.body).forEach(function (key) {
    if (key == 'sku') return
    if (key == 'quantity') return
    if (req.body[key] != '') input[key] = req.body[key]
  })
  input['items'] = []
  for (var i = 0; i < req.body['quantity'].length; i++) {
    item = { 'SKU': req.body['sku'][i], 'quantity': req.body['quantity'][i] }
    input['items'].push(item)
  }
  axios.put('/api/orders/edit', input, { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      if (response.status == 200) {
        res.redirect('/orders')
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

router.post('/delete', (req, res) => {
  axios.delete('/api/orders/delete', {data:req.body}, { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      if (response.status == 200) {
        res.sendStatus(200)
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

router.post('/invoice', (req, res) => {
  axios.put('/api/orders/invoice', req.body, { headers: { 'authorization': req.session.passport.user } })
    .then((response) => {
      if (response.status == 200) {
        res.redirect('/orders/invoice')
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


module.exports = router;
