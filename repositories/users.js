const fs = require('fs')

class UsersRepository {
  //check if the user info is saved into a json file
  constructor(filename) {  
    if (!filename) {
      throw new Error('Creating a repository requires a filename')
    }

    this.filename = filename;

    //check if the file exists, if it doesn't exist create file
    //constructor function cannot be async 
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, '[]')
    }
    

  }
}

new UsersRepository('users.json');