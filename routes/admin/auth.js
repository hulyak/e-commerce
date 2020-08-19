const express = require('express');
const usersRepo = require('../../repositories/users');

//replace app with router, Router object same with app
const router = express.Router();

router.get ('/signup', (req, res) => {
  res.send (`
  <div>
  Your id is: ${req.session.userId}
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input name="password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="password confirmation"/>
      <button>Sign up</button>
    </form>
  </div>
  `);
});


router.post ('/signup', async (req, res) => {
  const {email, password, passwordConfirmation} = req.body;

  const existingUser = await usersRepo.getOneBy ({email: email});
  if (existingUser) {
    return res.send ('Email in use');
  }

  if (password !== passwordConfirmation) {
    return res.send ('Passwords must match');
  }

  //Create a user in our user repo to represent this person
  const user = await usersRepo.create({ email, password });
  
  //Store the id of that user inside the users cookie
  // req.session === {} //added by cookie session! any info saved to the cookie
  req.session.userId = user.id;
  res.send ('account created');
});


router.get('/signout', (req, res) => {
  req.session = null; //destroy the session cookies
  res.send('You are logged out')
})


router.get('/signin', (req, res) => {
  res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email"/>
      <input name="password" placeholder="password" />
      <button>Sign In</button>
    </form>
  </div>
  `)
})


router.post('/signin', async(req, res) => {
  const { email, password } = req.body; //user supplies

  const user = await usersRepo.getOneBy({ email }); //database
  if (!user) {
    return res.send('Email not found')
  }

  const validPassword = await usersRepo.comparePasswords(
    user.password,
    password
  );
  if (!validPassword){
  return res.send('Invalid password')
  }
  
  // authenticate the user 
  req.session.userId = user.id;
  res.send("You are signed in")
});

module.exports = router;