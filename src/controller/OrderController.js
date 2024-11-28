const express = require('express');
const orderService = require('../service/OrderService');
const { verifyTokenAndAdmin } = require('../../middleware/verifyToken');

const router = express.Router();


router.post("/search", verifyTokenAndAdmin, orderService.search);

module.exports = router;