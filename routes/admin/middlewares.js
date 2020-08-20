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
};
