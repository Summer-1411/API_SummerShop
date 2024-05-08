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

		const [cart] = await pool.execute(`SELECT cart.id,filter.id as id_filter, cart.quantity,  product.name, filter.img, filter.color, filter.size, filter.price FROM cart 
		INNER JOIN filter ON cart.id_filter = filter.id
		INNER JOIN product ON filter.id_pro = product.id
		WHERE id_user = ?`
		, [req.user.id]);
		if (cart.length === 0)
			return res.status(200).json({ success: false, cart: [] })
		return res.json({ success: true, cart })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/', verifyToken, async (req, res) => {
    try {
		const [cart] = await pool.query(`INSERT INTO cart (id_user, id_filter, quantity) VALUES (?, ?, ?)`
		, [req.user.id, req.body.filter, req.body.quantity]);
		
		res.json({ success: true, message: "Đã thêm sản phẩm vào giỏ hàng"})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
	}
})


router.post('/insert-update', verifyToken, async (req, res) => {
    try {
		const [cartExist] = await pool.execute(`SELECT * FROM Cart WHERE id_user=${req.user.id} AND id_filter = ${req.body.filter}`)
		if(cartExist.length > 0){
			await pool.query(`UPDATE cart SET quantity = quantity + ? WHERE id_user = ? AND id_filter = ?`, [req.body.quantity, req.user.id, req.body.filter]);
			return res.status(200).json({ success: true, message: "Cập nhật giỏ hàng thành công"})
		}else {
			await pool.query(`INSERT INTO cart (id_user, id_filter, quantity) VALUES (?, ?, ?)`, [req.user.id, req.body.filter, req.body.quantity]);
			return res.status(200).json({ success: true, message: "Đã thêm vào giỏ hàng"})
		}
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
	}
})

router.put('/', verifyToken, async (req, res) => {
    try {
		const [cart] = await pool.query(`UPDATE cart SET quantity = ? WHERE id_user = ? AND id_filter = ?`, [req.body.quantity, req.user.id, req.body.id_filter]);
		res.json({ success: true, message: "Cập nhật giỏ hàng"})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.delete("/delete/:id", verifyToken, async (req, res) => {
	try {
		const [cart] = await pool.query(`DELETE FROM cart WHERE id_user = ? AND id_filter = ?`, [req.user.id, req.params.id]);
		return res.status(200).json({ success: true, message: "Xoá sản phẩm khỏi giỏ hàng thành công"})
	} catch (error) {
		console.log(error) 
		return res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
	}
})

router.delete("/clear", verifyToken, async (req, res) => {
	try {
		const [cart] = await pool.query(`DELETE FROM cart WHERE id_user = ?`, [req.user.id]);
		res.json({ success: true, message: "Giỏ hàng trống"})
	} catch (error) {
		console.log(error) 
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})
module.exports = router