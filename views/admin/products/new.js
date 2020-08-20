const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
  return layout({
    content: `
    <form method='POST' enctype="multipart/form-data">
      <input placeholder="Title" name="title" />
      <input placeholder="Price" name="price" />
      <input type="file" name="image" /> 
      <button>Submit</button>
    </form>
    `,
  });
};

//image file must be submitted to back end, not the 'name' of the file coming from req.post
//encoding type - enctype="application/x-www-form-urlencoded" default, query string on the end of the URL
//transmit raw file upload  - multipart/form-data, characters are not encoded
//req.body is connected to bodyParser and urlencoded, it doesn't work with multipart
//multipart returns the data in chunks, parts
