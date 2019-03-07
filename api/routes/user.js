const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/auth');
const { upload } = require("../middleware/uploads");
const UserController = require('../controllers/user');

router.post("/signup", upload.single('userImage'), UserController.user_signup);

router.post("/login", UserController.user_login);

router.get('/', checkAuth, UserController.user_get_all);

router.get('/get/:userId', checkAuth, UserController.user_get_user);

router.patch('/update/:userId', checkAuth, UserController.user_update_user);

router.delete('/delete/:userId', checkAuth, UserController.user_delete);

module.exports = router;