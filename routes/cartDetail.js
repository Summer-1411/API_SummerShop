const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const { verifyToken } = require('../middleware/verifyToken')
// // const db = require('../common/connectDB')
// const User = require('../models/User')

const pool = require('../common/connectDB')

router.get("/", verifyToken, async (req, res) => {
    try {
        const [cartDetail] = await pool.query(`SELECT cart_detail.*, cart.*, cart.id AS idCart 
        FROM cart INNER JOIN cart_detail 
        ON cart.id = cart_detail.id_cart
        WHERE cart.id_user = ?`, [req.user.id]);
        if (cartDetail.length === 0)
            return res.status(200).json({ success: true, message: 'Giỏ hàng trống' })
        res.status(200).json({ success: true, cartDetail: cartDetail[0] })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})

//thêm sản phẩm vào giỏ hàng
router.get("/", verifyToken, async (req, res) => {
    try {
        const [cartDetail] = await pool.query(`SELECT cart_detail.*, cart.*, cart.id AS idCart 
        FROM cart INNER JOIN cart_detail 
        ON cart.id = cart_detail.id_cart
        WHERE cart.id_user = ?`, [req.user.id]);
        if (cartDetail.length === 0)
            return res.status(200).json({ success: true, message: 'Giỏ hàng trống' })
        res.status(200).json({ success: true, cartDetail: cartDetail[0] })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


router.post("/", verifyToken, async (req, res) => {
    try {
        const [cartDetail] = await pool.query(`INSERT INTO cart_detail (id_cart, id_filter, quantity, subtotal) VALUES (?,?,?,?)`,
            [req.body.id_cart, req.body.id_filter, req.body.quantity, req.body.subtotal]);

        res.status(200).json({ success: true, message: "Thêm mới sản phẩm vào giỏ hàng" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


module.exports = router