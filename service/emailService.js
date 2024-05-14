const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendMail = asyncHandler(async ({ email, subject ,html }) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'duongqua2502@gmail.com', // generated ethereal user
            pass: 'cabh rqlm crma tcnm', // generated ethereal password
        },
    });
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"HoangTuan Shop !!! 👻" <duongqua2502@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
    });

    return info
})


let getBodyHTMLEmail = (dataSend) => {
    let result =
        `
        <h3>Xin chào ${dataSend.username}!</h3>
        <p>Chúng tôi rất vui vì đã đăng ký tài khoản trên cửa hàng HoangTuanShop.</p>
        <p>Sau đây là tin xác thực tài khoản của bạn để hoàn tất quá trình đăng ký</p>
        <p>Mã này sẽ hết hiệu lực trong vòng 3 phút.</p>
        <div>Xin chân thành cảm ơn!</div>
        <div><p>Mã xác thực OTP: <b>${dataSend.otp}</b></p></div>
    `
    return result;
} 

let getBodyHTMLEmailCancelOrder = (dataSend) => {
    let result = 
        `
        <h3>Xin chào ${dataSend.username}!</h3>
        <p>Bạn nhận được email vì đơn hàng của bạn đã không thể hoàn thành do ${dataSend.reason}</p>
        <p>Chúng tôi rất xin lỗi về sự cố lần này</p>
        <div>Xin chân thành cảm ơn!</div>
    `
    return result
}



module.exports = {
    sendMail,
    getBodyHTMLEmail,
    getBodyHTMLEmailCancelOrder
}