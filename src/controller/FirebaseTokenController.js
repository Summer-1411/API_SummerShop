const express = require('express');
const fireBaseTokenService = require('../service/FireBaseTokenService');
const { verifyTokenAndAdmin } = require('../../middleware/verifyToken');

const router = express.Router();


router.post("/create", fireBaseTokenService.create);

module.exports = router;
