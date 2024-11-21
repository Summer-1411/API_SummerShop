// src/controllers/productController.js
const express = require('express');
const userService = require('../service/UserService');
const { verifyTokenAndAdmin } = require('../../middleware/verifyToken');

const router = express.Router();


router.post("/filter", verifyTokenAndAdmin, userService.filter);

module.exports = router;
