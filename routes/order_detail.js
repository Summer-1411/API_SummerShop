const express = require('express')
const router = express.Router()
const { verifyToken } = require('../middleware/verifyToken')

const pool = require('../common/connectDB')

router.get("/:id_order", verifyToken, async (req, res) => {
    try {
        const query = `SELECT filter.id_pro, order_detail.id, order_detail.id_filter, order_detail.quantity, filter.size, filter.img, filter.color, order_detail.price, product.name
                        FROM order_detail INNER JOIN filter ON order_detail.id_filter = filter.id INNER JOIN product ON product.id = filter.id_pro
                        WHERE id_order = ?`;
        const [products] = await pool.query(query, req.params.id_order);

        return res.status(200).json({ success: true, products })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
    }
})




module.exports = router