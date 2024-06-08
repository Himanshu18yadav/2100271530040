// src/services/ecommerceService.js
const axios = require('axios');
const cache = require('../utils/cache');

const ECOMMERCE_APIS = [
  { name: 'AMZ', url: 'http://20.244.56.144/test/companies/AMZ/categories/' },
  { name: 'EBY', url: 'http://20.244.56.144/test/companies/EBY/categories/' },
  { name: 'WLM', url: 'http://20.244.56.144/test/companies/WLM/categories/' },
  { name: 'TSM', url: 'http://20.244.56.144/test/companies/TSM/categories/' },
  { name: 'BBY', url: 'http://20.244.56.144/test/companies/BBY/categories/' }
];

async function fetchProducts(category, minPrice = 0, maxPrice = 10000) {
  const cacheKey = `products_${category}_${minPrice}_${maxPrice}`;
  let products = await cache.get(cacheKey);

  if (!products) {
    products = [];
    const promises = ECOMMERCE_APIS.map(api =>
      axios.get(`${api.url}${category}/products?minPrice=${minPrice}&maxPrice=${maxPrice}`)
        .then(response => response.data)
        .catch(error => {
          console.error(`Error fetching products from ${api.name}:`, error.message);
          return [];
        })
    );

    const results = await Promise.all(promises);
    results.forEach(result => {
      products = products.concat(result);
    });

    await cache.set(cacheKey, products);
  }

  return products;
}

module.exports = { fetchProducts };
