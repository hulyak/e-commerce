const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
  //first Sanitization then validation
  requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must be a valid email')
    .custom(async (email) => {
      const existingUser = await usersRepo.getOneBy({ email: email });
      if (existingUser) {
        // return res.send('Email in use');
        throw new Error('Email in use');
      }
    }),
  requirePassword: check('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Must be between 6 and 20 characters'),

  requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Must be between 6 and 20 characters')
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
    }),

  requireEmailExists: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Must provide a valid email')
    .custom(async (email) => {
      const user = await usersRepo.getOneBy({ email });
      if (!user) {
        throw new Error('Email not found!');
      }
    }),

  requireValidPasswordForUser: check('password')
    .trim()
    .custom(async (password, { req }) => {
      const user = await usersRepo.getOneBy({ email: req.body.email }); //user can be 'undefined'
      if (!user) {
        throw new Error('Invalid password');
      }
      const validPassword = await usersRepo.comparePasswords(
        user.password, //from repo
        password
      );
      if (!validPassword) {
        // return res.send('Invalid password');
        throw new Error('Invalid password');
      }
    }),
};

//https://express-validator.github.io/docs/custom-validators-sanitizers.html
