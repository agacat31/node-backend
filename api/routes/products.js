const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const uploadFile = require("../middleware/uploads");
const ProductsController = require('../controllers/products');

router.get('/', ProductsController.products_get_all);

router.post('/save', checkAuth, uploadFile.upload.single('productImage'), ProductsController.products_create_product);

router.get('/get/:productId', ProductsController.products_get_product);

router.patch('/update/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/delete/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;