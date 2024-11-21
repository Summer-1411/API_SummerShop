const express = require('express')
const { format } = require('date-fns');
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator');
const { verifyToken } = require('../middleware/verifyToken')

const pool = require('../common/connectDB')
const { sendMail, getBodyHTMLEmail } = require('../service/emailService');
const { validExpiresTime } = require('../utils');
const { sendOTP } = require('../service/sendOTPServcice');
const { TYPE_SEND_OTP } = require('../constant');


router.get('/', verifyToken, async (req, res) => {

	try {
		const [user] = await pool.query(`SELECT * FROM user WHERE id = ?`, [req.user.id]);
		console.log({ user });
		if (user.length === 0)
			return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng' })
		res.status(200).json({ success: true, user: user[0] })
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/send_otp', async (req, res) => {
	const { email, username } = req.body
	if (!email || !username) {
		return res
			.status(400)
			.json({ success: false, message: 'Thiếu tham số  !' })
	}
	sendOTP(res, TYPE_SEND_OTP.REGISTER, email, username)
})

router.post('/send_otp_forgot', async (req, res) => {
	const { email } = req.body
	if (!email) {
		return res
			.status(400)
			.json({ success: false, message: 'Thiếu tham số  !' })
	}
	sendOTP(res, TYPE_SEND_OTP.FORGOT_PASSWORD, email)
})

router.post('/check-change-password', verifyToken, async (req, res) => {
	const { oldPassword } = req.body
	const idUser = req.user.id
	if (!oldPassword) {
		return res
			.status(400)
			.json({ success: false, message: 'Thiếu tham số  !' })
	}
	try {
		const [userExist] = await pool.query(`SELECT * FROM user WHERE id = ? AND deleted = ?`, [idUser, 0]);
		if (userExist.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: 'Tài khoản không tồn tại !' })
		}
		// id found
		const passwordValid = await argon2.verify(userExist[0].password, oldPassword)
		if (!passwordValid)
			return res
				.status(400)
				.json({ success: false, message: 'Mật khẩu cũ không chính xác' })
		sendOTP(res, TYPE_SEND_OTP.FORGOT_PASSWORD, userExist[0].email)
		// return res
		// 		.status(200)
		// 		.json({ success: true, message: 'Quá đỉnh !' })

	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/save-change-password', verifyToken, async (req, res) => {
	const { newPassword, otp } = req.body
	const idUser = req.user.id
	if (!newPassword || !otp) {
		return res
			.status(400)
			.json({ success: false, message: 'Missing parameters !' })
	}
	try {
		const [userExist] = await pool.query(`SELECT * FROM user WHERE id = ? AND deleted = ?`, [idUser, 0]);
		if (userExist.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: 'Tài khoản không tồn tại !' })
		}
		let [valueOTP] = await pool.query(`SELECT * FROM otp WHERE otp = ? ORDER BY createAt DESC`, [otp]);
		if (valueOTP[0]?.email !== userExist[0].email) {
			return res.status(400).json({ success: true, message: "Mã OTP không hợp lệ với email này !" })
		}
		if (valueOTP.length == 0) {
			return res.status(500).json({ success: false, message: "Mã OTP không hợp lệ !" })
		}
		console.log(valueOTP);
		let checkTimeExpires = validExpiresTime(valueOTP[0]?.createAt)
		console.log('check checkTimeExpires', checkTimeExpires);

		if (checkTimeExpires) {
			const hashedPassword = await argon2.hash(newPassword)
			let currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
			const [result] = await pool.query('UPDATE user set password = ?, updateAt=? WHERE email = ?', [hashedPassword, currentDateTime, valueOTP[0]?.email]);
			await pool.query(`DELETE FROM otp WHERE email = ?`, [valueOTP[0]?.email]);
			return res.status(200).json({ success: true, message: "Bạn đã đổi mật khẩu thành công" })
		}

		return res.status(400).json({ success: true, message: "Mã OTP đã hết hạn !" })
	} catch (error) {
		console.log('error', error);
		return res.status(500).json({ success: false, message: "Internal server error" })
	}
})

router.post('/forgot-password', async (req, res) => {
	const { email, password, otp } = req.body
	if (!email || !password || !otp) {
		return res
			.status(400)
			.json({ success: false, message: 'Missing parameters !' })
	}
	try {
		let [valueOTP] = await pool.query(`SELECT * FROM otp WHERE otp = ?`, [otp]);
		if (valueOTP[0]?.email !== email) {
			return res.status(400).json({ success: true, message: "Mã OTP không hợp lệ với email này !" })
		}
		if (valueOTP.length == 0) {
			return res.status(500).json({ success: false, message: "Mã OTP không hợp lệ !" })
		}
		console.log(valueOTP);
		let checkTimeExpires = validExpiresTime(valueOTP[0]?.createAt)
		console.log('check checkTimeExpires', checkTimeExpires);

		if (checkTimeExpires) {
			const hashedPassword = await argon2.hash(password)
			let currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
			const [result] = await pool.query('UPDATE user set password = ?, updateAt=? WHERE email = ?', [hashedPassword, currentDateTime, valueOTP[0]?.email]);
			await pool.query(`DELETE FROM otp WHERE email = ?`, [valueOTP[0]?.email]);
			return res.status(200).json({ success: true, message: "Bạn đã đổi mật khẩu thành công" })
		}

		return res.status(400).json({ success: true, message: "Mã OTP đã hết hạn !" })
	} catch (error) {
		return res.status(500).json({ success: false, message: "Internal server error" })
	}
})

router.post('/register_otp', async (req, res) => {
	const { email, password, username, otp } = req.body
	if (!email || !password || !username || !otp) {
		return res
			.status(400)
			.json({ success: false, message: 'Missing parameters !' })
	}
	try {
		let [valueOTP] = await pool.query(`SELECT * FROM otp WHERE otp = ?`, [otp]);
		if (valueOTP[0]?.email !== email) {
			return res.status(400).json({ success: true, message: "Mã OTP không hợp lệ với email này !" })
		}
		if (valueOTP.length == 0) {
			return res.status(500).json({ success: false, message: "Mã OTP không hợp lệ !" })
		}
		console.log(valueOTP);
		let checkTimeExpires = validExpiresTime(valueOTP[0]?.createAt)
		console.log('check checkTimeExpires', checkTimeExpires);

		if (checkTimeExpires) {
			const hashedPassword = await argon2.hash(password)
			const [result] = await pool.query('INSERT INTO user (email, password, username) VALUES (?, ?, ?)', [valueOTP[0]?.email, hashedPassword, username]);
			await pool.query(`DELETE FROM otp WHERE email = ?`, [valueOTP[0]?.email]);
			return res.status(200).json({ success: true, message: "Bạn đã đăng ký thành công" })
		}

		return res.status(400).json({ success: true, message: "Mã OTP đã hết hạn !" })
	} catch (error) {
		return res.status(500).json({ success: false, message: "Internal server error" })
	}
})

router.post('/register', async (req, res) => {
	const { email, password, username } = req.body
	if (!email || !password || !username) {
		return res
			.status(400)
			.json({ success: false, message: 'Missing parameters !' })
	}

	try {
		const [userExist] = await pool.query(`SELECT * FROM user WHERE email = ?`, [email]);
		if (userExist.length > 0) {
			return res.status(500).json({ success: false, message: "Email da ton tai !" })
		}

		else {
			// All good
			const hashedPassword = await argon2.hash(password)
			const [result] = await pool.query('INSERT INTO user (email, password, username) VALUES (?, ?, ?)', [email, hashedPassword, username]);
			return res.status(200).json({ success: true, message: "Người dùng mới đã được chèn vào cơ sở dữ liệu" })
		}

	} catch (error) {
		return res.status(500).json({ success: false, message: "Internal server error" })
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
		const [userExist] = await pool.query(`SELECT * FROM user WHERE email = ? AND status = ?`, [email, 1]);
		if (userExist.length === 0) {
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
		delete userExist[0].password
		delete userExist[0].deleted
		const accessToken = jwt.sign({
			id: userExist[0].id,
			isAdmin: userExist[0].isAdmin
		},
			process.env.ACCESS_TOKEN_SECRET
		)
		res.status(200).json({
			success: true,
			message: 'Bạn đã đăng nhập thành công',
			user: userExist[0],
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


module.exports = router
