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
        <div><p><b>Mã xác thực: ${dataSend.otp}</b></p></div>
        <p>Mã này sẽ hết hiệu lực trong vòng 15 phút.</p>
        <div>Xin chân thành cảm ơn!</div>
    `
    

    return result;
} 

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = ''
    if(dataSend.language === 'vi') {
        result=
        `
        <h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được email này vì đã khám bệnh thành công.</p>
        <p>Thông tin hóa đơn, đơn thuốc được gửi trong file đính kèm:</p>
        <div>Xin chân thành cảm ơn!</div>
    `
    }
    if(dataSend.language === 'en'){
        result=
        `
        <h3>Dear ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on BookingCare.</p>
        <p>Information to schedule an appointment:</p>
        <div>Sincerely thank!</div>
    `
    }

    return result
}

let sendAttachment = (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_APP, // generated ethereal user
          pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Fred Foo!!! 👻" <nguyenhuuson100401@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh ✔", // Subject line
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
    sendMail,
    getBodyHTMLEmail
}