const express = require('express')
const router = express.Router()

const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require('../middleware/verifyToken')


const pool = require('../common/connectDB')
const { validExpiresTime, numberWithCommas, validateVoucher } = require('../utils')

router.get("/check/:code", async (req, res) => {
    try {
        const code = req.params.code
        let sql = `SELECT id, code, value, quantity, maxMoney, expiredTime FROM voucher WHERE CODE = "${code}"`
        let [data] = await pool.execute(sql)
        const voucher = data[0];
        if (data.length === 0) {
            return res.status(400).json({ success: false, message: "Mã giảm giá không hợp lệ !" })
        }
        const checkTimeExpired = validExpiresTime(voucher.expiredTime, 0);
        if (!checkTimeExpired) {
            return res.status(400).json({ success: false, message: "Mã giảm giá đã hết hạn !" })
        }
        if (voucher.quantity === 0) {
            return res.status(400).json({ success: false, message: "Mã giảm giá đã được sử dụng hết, vui lòng nhập mã khác !" })
        }
        // let sqlUpdate = `UPDATE voucher SET quantity = quantity - ${1}  WHERE id = ${voucher.id} `
        // await pool.execute(sqlUpdate)
        return res.status(200).json({ success: true, message: "Áp dụng mã giảm giá thành công", data: voucher.value, lstVoucher: data })
    } catch (error) {
        console.log('errr', error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.post("/check-voucher", async (req, res) => {
    try {
        const { code, totalAmount } = req.body
        let sql = `SELECT * FROM voucher WHERE CODE = "${code}"`
        let [data] = await pool.execute(sql)
        const voucher = data[0];
        if (data.length === 0) {
            return res.status(400).json({ success: false, message: "Mã giảm giá không hợp lệ !" })
        }
        const checkTimeExpired = validExpiresTime(voucher.expiredTime, 0);
        if (!checkTimeExpired) {
            return res.status(400).json({ success: false, message: "Mã giảm giá đã hết hạn !" })
        }
        if (voucher.quantity === 0) {
            return res.status(400).json({ success: false, message: "Mã giảm giá đã được sử dụng hết, vui lòng nhập mã khác !" })
        }
        // console.log('start');

        // const voucher = await validateVoucher(req, res, code);

        // console.log('running');

        if (voucher.minOrderValue) {
            if (voucher.minOrderValue > totalAmount) {
                return res.status(400).json({ success: false, message: `Đơn hàng của bạn chưa đạt mức tối thiểu để sử dụng mã giảm giá này !` })
            }
        }

        const discountValue = totalAmount * voucher.value / 100;
        if (voucher.maxMoney) {
            if (voucher.maxMoney <= discountValue) {
                const dataResponse = {
                    discount: voucher.maxMoney,
                    code: code
                }
                return res.status(200).json({ success: true, message: `Áp dụng mã thành công. Giá trị giảm giá tối đa cho mã này là ${numberWithCommas(voucher.maxMoney)}`, data: dataResponse })
            } else {
                const dataResponse = {
                    discount: discountValue,
                    code: code
                }
                return res.status(200).json({ success: true, message: `Áp dụng mã thành công. Đã giảm giá ${numberWithCommas(voucher.maxMoney)}`, data: dataResponse })
            }
        }
        const dataResponse = {
            discount: discountValue,
            code: code
        }
        return res.status(200).json({ success: true, message: `Áp dụng mã giảm giá thành công. Đã giảm giá ${numberWithCommas(discountValue)}`, data: dataResponse })
    } catch (error) {
        console.log('errr', error);
        return res.status(500).json({ success: false, message: "Lỗi server !" })
    }
})




module.exports = router