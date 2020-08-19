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
};
