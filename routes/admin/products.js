const express = require('express');
const multer = require('multer'); //handle multi-part file upload

const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const { requireTitle, requirePrice, requireImage } = require('./validators');
const { handleErrors } = require('./middlewares');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//product listing
router.get('/admin/products', async (req, res) => {
  const products = await productsRepo.getAll();
  res.send(productsIndexTemplate({ products }));
});

router.get('/admin/products/new', (req, res) => {
  res.send(productsNewTemplate({}));
});

router.post(
  '/admin/products/new',
  upload.single('image'), //multer
  [requirePrice, requireTitle, requireImage], //validation
  handleErrors(productsNewTemplate),
  async (req, res) => {
    const image = req.file.buffer.toString('base64'); //return raw data into string, save into database
    const { title, price } = req.body;
    await productsRepo.create({ title, price, image });

    //return raw data, multipart-form data submission
    // req.on('data', (data) => {
    //   console.log(data.toString());
    // });

    res.redirect('/admin/products');
  }
);

module.exports = router;
