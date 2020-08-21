const { validationResult } = require('express-validator');

module.exports = {
  handleErrors(templateFunc, dataCallback) {
    //replace with the appropriate temp.
    return async (req, res, next) => {
      //middleware function
      const errors = validationResult(req); //show errors in the form

      if (!errors.isEmpty()) {
        let data = {}; //data can be undefined assign to empty object
        if (dataCallback) {
          data = await dataCallback(req);
        }
        // if there is an error, rerender the form
        return res.send(templateFunc({ errors, ...data }));
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

//dataCallback for products edit route
