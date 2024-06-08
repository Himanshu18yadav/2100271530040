// src/app.js
const express = require('express');
const { getTopProducts, getProductDetails } = require('./controllers/productsController');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/categories/:categoryname/products', getTopProducts);
app.get('/categories/:categoryname/products/:productid', getProductDetails);
app.get('/',function(req,res){
    res.send("goood way o f learning")
   
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
