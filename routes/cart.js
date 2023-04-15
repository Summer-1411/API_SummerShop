const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const {verifyToken} = require('../middleware/verifyToken')
// // const db = require('../common/connectDB')
// const User = require('../models/User')

const pool = require('../common/connectDB')


router.get('/', verifyToken, async (req, res) => {
    try {
		const [cart] = await pool.query(`SELECT * FROM cart WHERE id_user = ?`, [req.user.id]);
		if (cart.length === 0)
			return res.status(400).json({ success: false, message: 'Không tìm thấy giỏ hàng' })
		res.json({ success: true, cart: cart[0] })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/', verifyToken, async (req, res) => {
    try {
		const [cart] = await pool.query(`INSERT INTO cart (id_user) VALUES (?)`, [req.user.id]);
		res.json({ success: true})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.put('/', verifyToken, async (req, res) => {
    try {
		const [cart] = await pool.query(`UPDATE cart SET total_amount = ? WHERE id_user = ?`, [req.body.total, req.user.id]);
		res.json({ success: true, message: "Thêm mới sản phẩm vào giỏ hàng"})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


module.exports = router