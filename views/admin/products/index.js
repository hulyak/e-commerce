//product listing
const layout = require('../layout');

module.exports = ({ products }) => {
  const renderedProducts = products
    .map((product) => {
      return `
    <div>${product.title}</div>
    `;
    })
    .join(''); // join the array of strings

  return layout({
    content: `
    <h1 class="title">Products</h1>
    ${renderedProducts}
    `,
  });
};
