// src/controllers/voucherController.js
const voucherService = require('../service/VoucherService');
const { verifyTokenAndAdmin } = require('../../middleware/verifyToken');
const express = require('express');
const router = express.Router();

// API search voucher chưa hết hạn
router.get("/search", voucherService.searchNotExpired);
router.post("/filter", verifyTokenAndAdmin, voucherService.filter);
router.post("/create", verifyTokenAndAdmin, voucherService.create);
router.post("/update", verifyTokenAndAdmin, voucherService.update);
router.post("/delete", verifyTokenAndAdmin, voucherService.delete);

module.exports = router;
