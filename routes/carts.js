const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');
const router = express.Router();

//Receive a POST request to add an item to a cart
router.post('/cart/products', async (req, res) => {
  //console.log(req.body.productId); //assign to cart id
  // Figure out the cart! the user has a cart or not
  let cart;
  if (!req.session.cartId) {
    //we don't have a cart, we need to create one,
    //and store the cart id on the req.session.cartId property
    cart = await cartsRepo.create({ items: [] });
    req.session.cartId = cart.id;
  } else {
    //we have a cart! Lets get it from the repo
    cart = await cartsRepo.getOne(req.session.cartId);
  }

  const existingItem = cart.items.find(
    (item) => item.id === req.body.productId
  );
  //Either increment quantity for existing product
  if (existingItem) {
    existingItem.quantity++;
    //Or add new product to items array
  } else {
    cart.items.push({ id: req.body.productId, quantity: 1 });
  }
  //first arg. cart id  and second arg. the update we want to make
  await cartsRepo.update(cart.id, {
    items: cart.items,
  });

  res.send('Product added to cart');
});

//Receive a GET request to show all items in cart
router.get('/cart', async (req, res) => {
  if (!req.session.cartId) {
    return res.redirect('/');
  }
  const card = await cartsRepo.getOne(req.session.cartId);

  for (let item of cart.items) {
    // item === {id, quantity}
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});
//Receive a POST request to delete an item from a cart

module.exports = router;
