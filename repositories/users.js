const fs = require ('fs');
const crypto = require ('crypto');

class UsersRepository {
  //check if the user info is saved into a json file
  constructor (filename) {
    if (!filename) {
      throw new Error ('Creating a repository requires a filename');
    }

    this.filename = filename;

    //check if the file exists, if it doesn't exist, create new file
    //constructor function cannot be async
    try {
      fs.accessSync (this.filename);
    } catch (err) {
      fs.writeFileSync (this.filename, '[]');
    }
  }

  async getAll () {
    //open the file called this.filename, parse the contents of json data
    return JSON.parse (
      await fs.promises.readFile (this.filename, {
        encoding: 'utf-8',
      })
    );
  }

  async create (attributes) {
    attributes.id = this.randomId ();
    const records = await this.getAll ();
    records.push (attributes);
    //write the updated 'records' array back to this.filename
    await this.writeAll (records);
  }

  async writeAll (records) {
    await fs.promises.writeFile (
      this.filename,
      JSON.stringify (records, null, 2) //2 level of indentation
    );
  }

  randomId () {
    return crypto.randomBytes (4).toString ('hex'); //turn buffer data into hex
  }
}

const test = async () => {
  const repo = new UsersRepository ('users.json');
  await repo.create ({email: 'test@test.com', password: 'password'});
  const users = await repo.getAll ();
  console.log (users);
};

test ();
