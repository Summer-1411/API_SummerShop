const express = require('express')
const router = express.Router()

const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require('../middleware/verifyToken')


const pool = require('../common/connectDB')
const { validExpiresTime } = require('../utils')

router.get("/check/:code", async(req, res) => {
    try {
        const code = req.params.code
        let sql = `SELECT id, code, value, quantity, maxMoney, expiredTime FROM voucher WHERE CODE = "${code}"`
        let [data] = await pool.execute(sql)
        const voucher = data[0];
        if(data.length === 0){
            return res.status(400).json({success: false, message: "Mã giảm giá không hợp lệ !"})
        }
        const checkTimeExpired = validExpiresTime(voucher.expiredTime, 0);
        if(!checkTimeExpired){
            return res.status(400).json({success: false, message: "Mã giảm giá đã hết hạn !"})
        }
        if(voucher.quantity === 0){
            return res.status(400).json({success: false, message: "Mã giảm giá đã được sử dụng hết, vui lòng nhập mã khác !"})
        }
        let sqlUpdate = `UPDATE voucher SET quantity = quantity - ${1}  WHERE id = ${voucher.id} `
        await pool.execute(sqlUpdate)
        return res.status(200).json({success: true, message: "Áp dụng mã giảm giá thành công", data: voucher.value, lstVoucher: data})
    } catch (error) {
        console.log('errr',error);
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})

module.exports = router