const express = require('express');
const userController = require('../controllers/user.js');
const bcrypt = require('bcryptjs');
const { verify } = require('../auth');

const router = express.Router();


router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile)


module.exports = router;