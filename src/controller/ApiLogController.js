const express = require('express');
const apiLogService = require('../service/ApiLogService');
const { verifyTokenAndAdmin } = require('../../middleware/verifyToken');

const router = express.Router();


router.post("/search", verifyTokenAndAdmin, apiLogService.search);

module.exports = router;
