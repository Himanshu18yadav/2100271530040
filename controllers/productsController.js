// src/controllers/productsController.js
const { fetchProducts } = require('../services/ecommerceService');
const { v4: uuidv4 } = require('uuid');

function sortProducts(products, sortBy, order) {
  const compare = (a, b) => {
    if (a[sortBy] < b[sortBy]) return order === 'asc' ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return order === 'asc' ? 1 : -1;
    return 0;
  };
  return products.sort(compare);
}

async function getTopProducts(req, res) {
  const { categoryname } = req.params;
  const { n = 10, page = 1, sortBy = 'rating', order = 'desc', minPrice = 0, maxPrice = 10000 } = req.query;
  
  try {
    let products = await fetchProducts(categoryname, minPrice, maxPrice);

    // Add a unique ID to each product
    products = products.map(product => ({ ...product, id: uuidv4() }));

    // Sort products
    products = sortProducts(products, sortBy, order);

    // Paginate products
    const startIndex = (page - 1) * n;
    const endIndex = startIndex + parseInt(n, 10);
    const paginatedProducts = products.slice(startIndex, endIndex);

    res.json({ products: paginatedProducts });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getProductDetails(req, res) {
  const { categoryname, productid } = req.params;

  try {
    const products = await fetchProducts(categoryname);
    const product = products.find(p => p.id === productid);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { getTopProducts, getProductDetails };
