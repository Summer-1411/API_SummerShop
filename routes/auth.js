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


router.get('/', verifyToken, async (req, res) => {

	try {
		const [user] = await pool.query(`SELECT * FROM user WHERE id = ?`, [req.user.id]);
		console.log({ user });
		if (user.length === 0)
			return res.status(400).json({ success: false, message: 'Không tìm thấy người dùng' })
		res.json({ success: true, user: user[0] })
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
	try {
		const [userExist] = await pool.query(`SELECT * FROM user WHERE email = ?`, [email]);
		const [otpExist] = await pool.query(`SELECT * FROM otp WHERE email = ? ORDER BY createAt DESC`, [email]);
		if (userExist.length > 0) {
			return res.status(400).json({ success: false, message: "Email đã tồn tại !" })
		}
		if (otpExist.length > 0) {
			// nếu mã chưa quá 2p
			let checkValidResendEmail = validExpiresTime(otpExist[0]?.createAt, 2)
			if (checkValidResendEmail) {
				return res.status(400).json({ success: false, message: "Mã OTP đã được gửi. Vui lòng kiểm tra lại hộp thư email !" })
			}
		}

	

		let otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		let [valueOTP] = await pool.query(`SELECT * FROM otp WHERE otp = ?`, [otp]);
		while (valueOTP.length > 0) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
				lowerCaseAlphabets: false,
				specialChars: false,
			});
			[valueOTP] = await pool.query(`SELECT * FROM otp WHERE otp = ?`, [otp]);
		}
		const data = {
			email: email,
			subject: "Xác nhận đăng ký",
			html: getBodyHTMLEmail({
				username: username,
				otp: otp
			})
		}
		const rs = await sendMail(data)
		currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
		await pool.query('INSERT INTO otp (otp, email, createAt) VALUES (?, ?, ?)', [otp, email, currentDateTime]);

		return res.status(200).json({ success: true, message: "Gửi mã OTP thành công !" })


	} catch (error) {
		console.log('error', error);
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
		if(valueOTP[0]?.email !== email){
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
		const [userExist] = await pool.query(`SELECT * FROM user WHERE email = ? AND deleted = ?`, [email, 0]);
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
		const accessToken = jwt.sign({
			id: userExist[0].id,
			isAdmin: userExist[0].isAdmin
		},
			process.env.ACCESS_TOKEN_SECRET
		)
		res.json({
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
