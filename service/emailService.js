const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')

const sendMail = asyncHandler(async ({ email, subject, html }) => {
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
        from: '"Summer Shop !!! 👻" <duongqua2502@gmail.com>', // sender address
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
        <p>Chúng tôi rất vui vì đã đăng ký tài khoản trên cửa hàng Summer Shop.</p>
        <p>Sau đây là tin xác thực tài khoản của bạn để hoàn tất quá trình đăng ký</p>
        <p>Mã này sẽ hết hiệu lực trong vòng 15 phút.</p>
        <div>Xin chân thành cảm ơn!</div>
        <div><p>Mã xác thực OTP: <b>${dataSend.otp}</b></p></div>
    `
    return result;
}

let getBodyHTMLForgotPassword = (dataSend) => {
    let result =
        `
        <h3>Xin chào ${dataSend.email}!</h3>
        <p>Chúng tôi nhận được yêu cầu lấy lại mật khẩu của bạn trên cửa hàng Summer Shop.</p>
        <p>Nếu thực sự là bạn. Vui lòng nhập mã OTP để thực hiện quá trình lấy lại mật khẩu</p>
        <p>Mã này sẽ hết hiệu lực trong vòng 15 phút.</p>
        <div>Xin chân thành cảm ơn!</div>
        <div><p>Mã xác thực OTP: <b>${dataSend.otp}</b></p></div>
    `
    return result;
}

let getBodyHTMLChangePassword = (dataSend) => {
    let result =
        `
        <h3>Xin chào ${dataSend.email}!</h3>
        <p>Chúng tôi nhận được yêu cầu cập nhật mật khẩu của bạn trên cửa hàng Summer Shop.</p>
        <p>Nếu thực sự là bạn. Vui lòng nhập mã OTP để thực hiện quá trình cập nhật mật khẩu</p>
        <p>Mã này sẽ hết hiệu lực trong vòng 15 phút.</p>
        <div>Xin chân thành cảm ơn!</div>
        <div><p>Mã xác thực OTP: <b>${dataSend.otp}</b></p></div>
    `
    return result;
}

let getBodyHTMLSoldOut = (dataSend) => {
    let result =
        `
        <h3>Thông báo từ hệ thống</h3>
        <p>Sản phẩm : ${dataSend.name}</p>
        <p>Màu sắc : ${dataSend.color}</p>
        <p>Dung lượng : ${dataSend.size}</p>
        <p>Sản phẩm này hiện đã hết hàng có trong kho !. Vui lòng nhập thêm hàng để tránh gián đoạn quá trình bán hàng của cửa hàng</p>
        <div>Xin chân thành cảm ơn!</div>
    `
    return result;
}

let getBodyHTMLEmailCancelOrder = (dataSend) => {
    let result =
        `
        <h3>Xin chào ${dataSend.fullName}!</h3>
        <p>Bạn nhận được email vì đơn hàng của bạn đã không thể hoàn thành vì lí do ${dataSend.reason}</p>
        <p>Chúng tôi rất xin lỗi về sự cố lần này</p>
        <div>Xin chân thành cảm ơn!</div>
        <div> Sau đây là thông tin hóa đơn của bạn</div>
    `
    return result
}

let getBodyHTMLEmailSuccessOrder = (fullName) => {
    let result =
        `
        <h3>Xin chào ${fullName}!</h3>
        <p>Bạn nhận được email vì đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã luôn tin tưởng cửa hàng </p>
        <div> Sau đây là thông tin hóa đơn của bạn</div>
    `
    return result
}




module.exports = {
    sendMail,
    getBodyHTMLEmail,
    getBodyHTMLEmailCancelOrder,
    getBodyHTMLForgotPassword,
    getBodyHTMLChangePassword,
    getBodyHTMLSoldOut,
    getBodyHTMLEmailSuccessOrder
}