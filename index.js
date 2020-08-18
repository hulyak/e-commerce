const express = require ('express');
const bodyParser = require ('body-parser');
const usersRepo = require ('./repositories/users');

const app = express ();

app.use (bodyParser.urlencoded ({extended: true}));

app.get ('/', (req, res) => {
  res.send (`
  <div>
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input name="password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="password confirmation"/>
      <button>Sign up</button>
    </form>
  </div>
  `);
});

app.post ('/', async (req, res) => {
  const {email, password, passwordConfirmation} = req.body;

  const existingUser = await usersRepo.getOneBy ({email: email});
  if (existingUser) {
    return res.send ('Email in use');
  }

  if (password !== passwordConfirmation) {
    return res.send ('Passwords must match');
  }

  res.send ('account created');
});

app.listen (3000, () => {
  console.log ('listening on port 3000');
});
