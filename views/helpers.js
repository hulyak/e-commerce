module.exports = {
  getError(errors, prop) {
    //prop === 'email' || 'password' || 'passwordConfirmation'
    try {
      return errors.mapped()[prop].msg;
    } catch (err) {
      //no error
      return '';
    }
  },
};

//export as an object
//errors is an array, errors.mapped gives an object
//mapped is from express validator library
//errors.mapped() === {
// email: {
//     msg: 'Must be a valid email',
//   }
// passwordConfirmation : {
//   msg: 'Password confirmation does not match password',
// }
