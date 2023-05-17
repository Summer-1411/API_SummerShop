const express = require('express')
const router = express.Router()

const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require('../middleware/verifyToken')


const pool = require('../common/connectDB')

router.get("/count", verifyTokenAndAdmin,async(req, res) => {
    try {
        let [user] = await pool.execute(`SELECT COUNT(*) AS numberUser FROM user WHERE deleted = ?`, [0])
        let [product] = await pool.execute(`SELECT COUNT(*) AS numberProduct FROM product WHERE deleted = ?`, [0])
        let [order] = await pool.execute(`SELECT COUNT(*) AS numberOrder FROM orders`)
        let [productSold] = await pool.execute(`SELECT SUM(quantity) AS total_sold FROM order_detail 
                                            WHERE id_order IN (SELECT id FROM orders WHERE status <> ${-1} AND status <> ${-2})`)
        return res.status(200).json({user: user[0], product: product[0], order: order[0], productSold: productSold[0]})
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})



router.get("/top-user", verifyTokenAndAdmin, async(req, res) => {
    try {
        let [user] = await pool.execute(`SELECT u.id, u.email, u.username, u.avatar, u.createAt, SUM(o.total_amount) AS total_order_value
                                        FROM user u
                                        JOIN orders o ON u.id = o.id_user
                                        GROUP BY u.id
                                        ORDER BY total_order_value DESC`)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})

router.get("/top-product", verifyTokenAndAdmin, async(req, res) => {
    try {
        let [product] = await pool.execute(`SELECT p.id, p.name, p.img, p.createAt, SUM(od.quantity) AS total_quantity
                                        FROM product p
                                        JOIN filter f ON p.id = f.id_pro
                                        JOIN order_detail od ON f.id = od.id_filter
                                        JOIN orders o ON od.id_order = o.id
                                        WHERE o.status <> ${-1} AND o.status <> ${-2}
                                        GROUP BY p.id, p.name, p.img
                                        ORDER BY total_quantity DESC`)
        return res.status(200).json(product)
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})

router.get("/sold/:id", async(req, res) => {
    const id = req.params.id
    try {
        let [product] = await pool.execute(`SELECT p.id, SUM(od.quantity) AS total_quantity
                                            FROM product p
                                            JOIN filter f ON p.id = f.id_pro
                                            JOIN order_detail od ON f.id = od.id_filter
                                            JOIN orders o ON od.id_order = o.id
                                            WHERE o.status <> ${-1} AND o.status <> ${-2} AND p.id = ?
                                            GROUP BY p.id`, [id])
        return res.status(200).json(product[0])
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})
router.get("/bought/:id", async(req, res) => {
    const id = req.params.id
    try {
        let [product] = await pool.execute(`SELECT o.id_user, SUM(od.quantity) AS total_quantity
                                            FROM product p
                                            JOIN filter f ON p.id = f.id_pro
                                            JOIN order_detail od ON f.id = od.id_filter
                                            JOIN orders o ON od.id_order = o.id
                                            WHERE o.status <> ${-1} AND o.status <> ${-2} AND o.id_user = ?
                                            GROUP BY o.id_user`, [id])
        return res.status(200).json(product[0])
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})
router.get("/stat-byUser/:id", verifyTokenAndAdmin,async(req, res) => {
    let id = req.params.id
    try {
        let [order] = await pool.execute(`SELECT COUNT(*) AS numberOrder, SUM(total_amount) as money FROM orders WHERE id_user = ? AND status <> ${-1} AND status <> ${-2}`, [id])
        let [orderCancel] = await pool.execute(`SELECT COUNT(*) AS numberOrderCancel, SUM(total_amount) as money FROM orders WHERE id_user = ? AND status = ${-1}`, [id])
        let [product] = await pool.execute(`SELECT o.id_user, SUM(od.quantity) AS total_quantity
                                            FROM product p
                                            JOIN filter f ON p.id = f.id_pro
                                            JOIN order_detail od ON f.id = od.id_filter
                                            JOIN orders o ON od.id_order = o.id
                                            WHERE o.status <> ${-1} AND o.status <> ${-2} AND o.id_user = ?
                                            GROUP BY o.id_user`, [id])
        return res.status(200).json({order: order[0], orderCancel: orderCancel[0], product: product[0]})
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})








module.exports = router