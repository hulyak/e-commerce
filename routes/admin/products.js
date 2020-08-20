const express = require('express');
const { validationResult } = require('express-validator');
const multer = require('multer'); //handle multi-part file upload

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/admin/products', (req, res) => {});

router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  [requirePrice, requireTitle], //validation
  upload.single('image'), //multer
  (req, res) => {
    const errors = validationResult(req);
    console.log(req.file);

    //return raw data, multipart-form data submission
    // req.on('data', (data) => {
    //   console.log(data.toString());
    // });

    res.send('submitted');
  }
);

module.exports = router;
