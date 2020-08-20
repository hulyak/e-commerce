const { validationResult } = require('express-validator');

module.exports = {
  handleErrors(templateFunc) {
    //replace with the appropriate temp.
    return (req, res, next) => {
      //middleware function
      const errors = validationResult(req); //show errors in the form

      if (!errors.isEmpty()) {
        // if there is an error, rerender the form
        return res.send(templateFunc({ errors }));
      }

      next(); //if there is an error, it doesn't run
    };
  },

  //require auth to edit or create products from admin panel
  //if the user is signed in, we can access the req.session.id
  requireAuth(req, res, next) {
    if (!req.session.userId) {
      return res.redirect('/signin');
    }
    next();
  },
};
