const express = require('express');
const { validationResult } = require('express-validator');
const router = express.Router();
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post('/admin/products/new', [requirePrice, requireTitle], (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  // if (!errors.isEmpty()) {
  //   return res.send(productsNewTemplate({ errors }));
  // }
  res.send('submitted');
});
module.exports = router;
