const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ errors }) => {
  return layout({
    content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="subtitle">Create a Product</h1>

          <form method="POST" enctype="multipart/form-data">
            <div class="field">
              <label class="label">Title</label>
              <input class="input" placeholder="Title" name="title">
              <p class="help is-danger">${getError(errors, 'title')}</p>
            </div>
            
            <div class="field">
              <label class="label">Price</label>
              <input class="input" placeholder="Price" name="price">
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>
            
            <div class="field">
              <label class="label">Image</label>            
              <input type="file" name="image" />
              <p class="help is-danger">${getError(errors, 'image')}</p>
            </div>
            <br />
            <button class="button is-primary">Create</button>
          </form>
        </div>
      </div>
    `,
  });
};

//image file must be submitted to back end, not the 'name' of the file coming from req.post
//encoding type - enctype="application/x-www-form-urlencoded" default, query string on the end of the URL
//transmit raw file upload  - multipart/form-data, characters are not encoded
//req.body is connected to bodyParser and urlencoded, it doesn't work with multipart
//multipart returns the data in chunks, parts
