const fs = require ('fs');
const crypto = require ('crypto');
const util = require('util'); //util.promisify
//password hashing algorithm
const scrypt = util.promisify(crypto.scrypt);

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

  async create(attributes) {
    // attributes === {email: '', password: '' }
    attributes.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    // scrypt(attributes.password, salt, 64, (err, buffer) => {
    //   const hashed = buffer.toString('hex')
    // })

    //with promisify
    const buffer = await scrypt(attributes.password, salt, 64)

    const records = await this.getAll();
    const record = {
        ...attributes,
        password: `${buffer.toString('hex')}.${salt}` //hash + salt, replace the password in plain text
    }
    records.push(record);
    //write the updated 'records' array back to this.filename
    await this.writeAll (records);
    return record;
  }

  async comparePasswords(saved, supplied) {
    //Saved => password saved in our database 'hashed.salt'
    //Supplied => password given to us by a user trying sign in
    // const result = saved.split('.');
    // const hashed = result[0]
    // const salt = result[1]

    const [hashed, salt] = saved.split('.')
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

   return hashed === hashedSuppliedBuf.toString('hex'); //turn buffer into string
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

  async getOne (id) {
    const records = await this.getAll ();
    return records.find (record => record.id === id);
  }

  async delete (id) {
    const records = await this.getAll ();
    const filteredRecords = records.filter (record => record.id !== id); //return true
    await this.writeAll (filteredRecords);
  }

  async update (id, attributes) {
    const records = await this.getAll ();
    const record = records.find (record => record.id === id);

    if (!record) {
      throw new Error (`Record with id ${id} not found`);
    }
    // Object.assign mutates the first argument passed to it.  In other words, we are making changes to the 'record' object - we are not creating a new one.
    Object.assign (record, attributes);
    await this.writeAll (records);
  }

  async getOneBy (filters) {
    const records = await this.getAll ();
    for (let record of records) {
      //array
      let found = true;

      for (let key in filters) {
        //object, compare key value pairs
        if (record[key] !== filters[key]) {
          found = false;
        }
      }

      if (found) {
        return record;
      }
    }
  }
}
//export an instance
module.exports = new UsersRepository ('users.json');

// const test = async () => {
//   const repo = new UsersRepository ('users.json');
// await repo.create ({email: 'test@test.com', password: 'password'});
// const users = await repo.getAll ();
// const user = await repo.getOne('4b434f0e');
// await repo.delete ('7596463b');
// console.log (user);
// await repo.update ('02ab2230', {name: 'hulya'});
//   const user = await repo.getOneBy ({
//     email: 'test@test.com',
//     id: '02ab2230',
//   });
//   console.log (user);
// };

// test ();
