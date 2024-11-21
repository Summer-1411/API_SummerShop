// src/controllers/productController.js
const express = require('express');
const productService = require('../service/ProductService');
const { verifyTokenAndAdmin } = require('../../middleware/verifyToken');

const router = express.Router();


router.get("/get-all", productService.getAll);
router.post("/create", verifyTokenAndAdmin, productService.create);
router.post("/update", verifyTokenAndAdmin, productService.update);
router.get("/find/:id", productService.findById);

module.exports = router;
