const pool = require('../common/connectDB');
const { TYPE_SEND_OTP } = require('../constant');
const { validExpiresTime } = require('../utils');
const { format } = require('date-fns');
const { getBodyHTMLEmail, getBodyHTMLForgotPassword, sendMail, getBodyHTMLChangePassword } = require('./emailService');
const otpGenerator = require('otp-generator');

const sendOTP = async (res, type, email, username) => {
    try {
		const [userExist] = await pool.query(`SELECT * FROM user WHERE email = ?`, [email]);
		const [otpExist] = await pool.query(`SELECT * FROM otp WHERE email = ? ORDER BY createAt DESC`, [email]);
		if(type === TYPE_SEND_OTP.REGISTER){
            if (userExist.length > 0) {
                return res.status(400).json({ success: false, message: "Email đã tồn tại !" })
            }
        }else if(type === TYPE_SEND_OTP.FORGOT_PASSWORD || type === TYPE_SEND_OTP.CHANGE_PASSWORD){
            if (userExist.length === 0) {
                return res.status(400).json({ success: false, message: "Tài khoản email không tồn tại !" })
            }
        }
        
		if (otpExist.length > 0) {
			// nếu mã chưa quá 2p
			let checkValidResendEmail = validExpiresTime(otpExist[0]?.createAt, 2)
			if (checkValidResendEmail) {
				return res.status(400).json({ success: false, message: "Mã OTP đã được gửi. Hai lần gửi cách nhau tối thiểu 2 phút !. Vui lòng kiểm tra lại hộp thư email !" })
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
        let data;
        if(type === TYPE_SEND_OTP.REGISTER){
            data = {
                email: email,
                subject: "Xác nhận đăng ký",
                html: getBodyHTMLEmail({
                    username: username,
                    otp: otp
                })
            }
        }else if(type === TYPE_SEND_OTP.FORGOT_PASSWORD) {
            data = {
                email: email,
                subject: "Lấy lại mật khẩu",
                html: getBodyHTMLForgotPassword({
                    email: email,
                    otp: otp
                })
            }
        }else if(type === TYPE_SEND_OTP.CHANGE_PASSWORD){
			data = {
                email: email,
                subject: "Cập nhật mật khẩu",
                html: getBodyHTMLChangePassword({
                    email: email,
                    otp: otp
                })
            }
		}
		 
		const rs = await sendMail(data)
		currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
		await pool.query('INSERT INTO otp (otp, email, createAt) VALUES (?, ?, ?)', [otp, email, currentDateTime]);

		return res.status(200).json({ success: true, message: "Gửi mã OTP thành công !" })


	} catch (error) {
		console.log('error', error);
		return res.status(500).json({ success: false, message: "Internal server error" })
	}
}


module.exports = {
    sendOTP
}