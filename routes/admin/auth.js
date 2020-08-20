const express = require('express');
//replace app with router, Router object same with app
const router = express.Router();
const { handleErrors } = require('./middlewares');
//repo
const usersRepo = require('../../repositories/users');
//templates
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
//validators
const {
  requireEmail,
  requirePassword,
  requirePasswordConfirmation,
  requireEmailExists,
  requireValidPasswordForUser,
} = require('./validators');

router.get('/signup', (req, res) => {
  res.send(signupTemplate({ req: req }));
});

router.post(
  '/signup',
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate),
  async (req, res) => {
    const { email, password } = req.body;
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
  res.send(signinTemplate({})); //in case 'errors' object
});

router.post(
  '/signin',
  [requireEmailExists, requireValidPasswordForUser],
  handleErrors(signinTemplate),
  async (req, res) => {
    const { email } = req.body; //user supplies
    const user = await usersRepo.getOneBy({ email }); //database
    // authenticate the user
    req.session.userId = user.id;
    res.send('You are signed in');
  }
);

module.exports = router;
