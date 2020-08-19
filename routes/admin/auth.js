const express = require('express');
const { check, validationResult } = require('express-validator');

//repo
const usersRepo = require('../../repositories/users');
//templates
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
} = require('./validators');

//replace app with router, Router object same with app
const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req: req }));
});

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  async (req, res) => {
    const errors = validationResult(req); //show errors in the form

    if (!errors.isEmpty()) {
      //if there is an error, rerender the form
      return res.send(signupTemplate({ req: req, errors }));
    }

    const { email, password, passwordConfirmation } = req.body;
    // if (password !== passwordConfirmation) {
    //   return res.send('Passwords must match');
    // }
    //Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email, password });

    //Store the id of that user inside the users cookie
    // req.session === {} //added by cookie session! any info saved to the cookie
    req.session.userId = user.id;
    res.send('account created');
  }
);

router.get('/signout', (req, res) => {
  req.session = null; //destroy the session cookies
  res.send('You are logged out');
});

router.get('/signin', (req, res) => {
  res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body; //user supplies

  const user = await usersRepo.getOneBy({ email }); //database
  if (!user) {
    return res.send('Email not found');
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword) {
    return res.send('Invalid password');
  }

  // authenticate the user
  req.session.userId = user.id;
  res.send('You are signed in');
});

module.exports = router;
