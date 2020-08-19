const layout = require('../layout');

const getError = (errors, prop) => {
  try {
    return errors.mapped()[prop].msg;
  } catch (err) {
    //no error
    return '';
  }
};

module.exports = ({ errors }) => {
  return layout({
    content: `
   <div>
    <form method="POST">
      <input name="email" placeholder="email" />
      ${getError(errors, 'email')}
      <input name="password" placeholder="password" />
      ${getError(errors, 'password')}
      <button>Sign In</button>
    </form>
  </div>
    `,
  });
};

//pass the content value with signin html
