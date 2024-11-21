// src/controllers/productController.js
const express = require('express');
const filterService = require('../service/FilterService');
const { verifyTokenAndAdmin } = require('../../middleware/verifyToken');

const router = express.Router();


router.get("/infor/:id", filterService.getInforByIdProd);
router.post("/detail", filterService.getDetailByIdProdColorSize);

module.exports = router;
