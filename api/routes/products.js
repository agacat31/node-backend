const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/auth');

const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Math.random() + '_' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    // Reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
const upload = multer({
    storage: storage,
    limits: 1024 * 1024 * 5,
    fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);

router.post('/save', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/get/:productId', ProductsController.products_get_product);

router.patch('/update/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/delete/:productId', checkAuth, ProductsController.products_delete_product);

module.exports = router;