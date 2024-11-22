const express = require('express');
const fireBaseTokenService = require('../service/FireBaseTokenService');
const { verifyTokenAndAdmin, verifyOptionalToken } = require('../../middleware/verifyToken');

const router = express.Router();


router.post("/create", verifyOptionalToken, fireBaseTokenService.create);

module.exports = router;
