const fs = require('fs');
const crypto = require('crypto');
const util = require('util'); //util.promisify
//password hashing algorithm
const scrypt = util.promisify(crypto.scrypt);
const Repository = require('./repository');

class UsersRepository extends Repository {
  async create(attributes) {
    // attributes === {email: '', password: '' }
    attributes.id = this.randomId();

    const salt = crypto.randomBytes(8).toString('hex');
    // scrypt(attributes.password, salt, 64, (err, buffer) => {
    //   const hashed = buffer.toString('hex')
    // })

    //with promisify
    const buffer = await scrypt(attributes.password, salt, 64);

    const records = await this.getAll();
    const record = {
      ...attributes,
      password: `${buffer.toString('hex')}.${salt}`, //hash + salt, replace the password in plain text
    };
    records.push(record);
    //write the updated 'records' array back to this.filename
    await this.writeAll(records);
    return record;
  }

  async comparePasswords(saved, supplied) {
    //Saved => password saved in our database 'hashed.salt'
    //Supplied => password given to us by a user trying sign in
    // const result = saved.split('.');
    // const hashed = result[0]
    // const salt = result[1]

    const [hashed, salt] = saved.split('.');
    const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

    return hashed === hashedSuppliedBuf.toString('hex'); //turn buffer into string
  }
}

//export an instance
module.exports = new UsersRepository('users.json');

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
