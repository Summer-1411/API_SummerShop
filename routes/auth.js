const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const {verifyToken} = require('../middleware/verifyToken')
// // const db = require('../common/connectDB')
// const User = require('../models/User')

const pool = require('../common/connectDB')

// @route GET api/auth
// @desc Check if user is logged in
// @access Public

router.get('/', verifyToken, async (req, res) => {
	
	try {
		const [user] = await pool.query(`SELECT * FROM user WHERE id = ?`, [req.user.id]);
		console.log({user});
		if (user.length === 0)
			return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng' })
		res.json({ success: true, user: user[0] })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/register', async (req, res) => {
	const { email, password, username } = req.body
	if(!email || !password || !username){
		return res
		.status(400)
		.json({ success: false, message: 'Missing parameters !' })
	}
	
	try {
		const [userExist] = await pool.query(`SELECT * FROM user WHERE email = ?`, [email]);
		if(userExist.length > 0){
			return res.status(500).json({ success: false, user: "Email da ton tai !"})
		}
		else {
			// All good
			const hashedPassword = await argon2.hash(password)
			const [result] = await pool.query('INSERT INTO user (email, password, username) VALUES (?, ?, ?)', [email, hashedPassword, username]);
			
			// Return token
			// console.log({result, fields});
			// const accessToken = jwt.sign(
			// 	{ userId: result.insertId },
			// 	process.env.ACCESS_TOKEN_SECRET
			// )
			
			return res.status(200).json({ success: true, message: "Người dùng mới đã được chèn vào cơ sở dữ liệu"})
		}
		
	} catch (error) {
		return res.status(500).json({success: false, message: "Internal server error"})
	}
	
})

router.post('/login', async (req, res) => {
	const { email, password } = req.body

	// Simple validation
	if (!email || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Thiếu tên người dùng hoặc mật khẩu' })

	try {
		// Check for existing user
		const [userExist] = await pool.query(`SELECT * FROM user WHERE email = ? AND deleted = ?`, [email, 0]);
		if (userExist.length === 0){
			return res
				.status(400)
				.json({ success: false, message: 'Tài khoản không tồn tại !' })
		}
		

		// Username found
		const passwordValid = await argon2.verify(userExist[0].password, password)
		if (!passwordValid)
			return res
				.status(400)
				.json({ success: false, message: 'Mật khẩu không chính xác' })

		// const [userDeleted] = await pool.query(`SELECT * FROM user WHERE email = ? AND deleted = ?`, [email,'1']);
		// if (userDeleted.length > 0){
		// 	return res
		// 		.status(400)
		// 		.json({ success: false, message: 'Tài khoản đã bị xoá !'})
		// }
		
		// All good
		// Return token
		const accessToken = jwt.sign({ 
			id: userExist[0].id,
			isAdmin: userExist[0].isAdmin
		},process.env.ACCESS_TOKEN_SECRET
		)
		res.json({
			success: true,
			message: 'Người dùng đăng nhập thành công',
			user: userExist[0],
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


module.exports = router
