const express = require('express')
const router = express.Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken')


const pool = require('../common/connectDB')


//Khách hàng đặt hàng thì số lượng sản phẩm sẽ giảm đi
async function updateFiltersQuantities(products) {
    const connection = await pool.getConnection();
    try {
        for (const product of products) {
            await connection.query(
                'UPDATE filter SET quantity = quantity - ? WHERE id = ?',
                [product.quantity, product.id_filter]
            );
        }
    } finally {
        connection.release();
    }
}

//Nếu admin không xác nhận đơn hàng thì sản phảm sẽ trở về ban đầu
async function updateFiltersQuantitiesByAdminCancel(products) {
    const connection = await pool.getConnection();
    try {
        for (const product of products) {
            await connection.query(
                'UPDATE filter SET quantity = quantity + ? WHERE id = ?',
                [product.quantity, product.id_filter]
            );
        }
    } finally {
        connection.release();
    }
}

//Nếu admin hoàn tác lại chức năng huỷ bỏ thì số lượng sản phẩm sẽ bị giảm như khi kháhc đặt



router.post('/', verifyToken, async (req, res) => {
    try {
        const query = `INSERT INTO orders (id_user, fullname, phone, shipping_address, shipping_method, total_amount, note) VALUES (?, ?, ?, ?, ?, ?, ?)`
        const [result] = await pool.query(query
            , [req.user.id, req.body.fullname, req.body.phone, req.body.address, req.body.methodShip, req.body.total, req.body.note]);
        const products = req.body.products
        const values1 = products.map(item => [result.insertId, item.id_filter, item.quantity]);

        await updateFiltersQuantities(products)
        const sql = 'INSERT INTO order_detail (id_order, id_filter, quantity) VALUES ?';
        const [result1] = await pool.query(sql, [values1]);

        
        return res.status(200).json({ success: true, message: 'Đặt hàng thành công' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
    }
})
router.get("/byCustomer", verifyToken, async (req, res) => {
    try {
        //Đã duyệt
        const confirm = req.query.confirm;
        //Đã hoàn thành
        const success = req.query.success;
        //Đã huỷ bởi khách hàng
        const cancel = req.query.cancel;

        const query = `SELECT orders.id, orders.fullname, orders.phone, orders.orderDate, orders.status, orders.note, orders.reason, orders.shipping_address, orders.total_amount
                        FROM orders
                        WHERE id_user = ? AND status = ? ORDER BY orders.orderDate DESC`;

        //Đơn đã đặt
        if (confirm) {
            const [order] = await pool.query(query, [req.user.id, 1]);
            return res.status(200).json({ success: true, order })
        } else if (success) {
            const [order] = await pool.query(query, [req.user.id, 2]);
            return res.status(200).json({ success: true, order })
        } else if (cancel) {
            const [order] = await pool.query(query, [req.user.id, -1]);
            return res.status(200).json({ success: true, order })
        }

        //Mặc định lấy các đơn đang chờ xử lý
        const [order] = await pool.query(query, [req.user.id, 0]);
        const [orderError] = await pool.query(query, [req.user.id, -2]);
        return res.status(200).json({ success: true, order, orderError })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
})
// //Đơn chưa được admin duyệt
// router.get("/", verifyToken, async (req, res) => {
//     try {
//         const query = `SELECT orders.id, orders.fullname, orders.phone, orders.orderDate, orders.status, orders.shipping_address, orders.total_amount
//                         FROM orders
//                         WHERE id_user = ? AND status = ?`;
//         const [order] = await pool.query(query, [req.user.id, 0]);

//         return res.status(200).json({ success: true, order })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ success: false, message: 'Internal server error' })
//     }
// })

// //Đơn khách hàng đã huỷ
// router.get("/cancel", verifyToken, async (req, res) => {
//     try {
//         const query = `SELECT orders.id, orders.fullname, orders.phone, orders.orderDate, orders.status, orders.shipping_address, orders.total_amount
//                         FROM orders
//                         WHERE id_user = ? AND status = ?`;
//         const [order] = await pool.query(query, [req.user.id, -1]);

//         return res.status(200).json({ success: true, order })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({ success: false, message: 'Internal server error' })
//     }
// })



//-1: Đơn hàng khách huỷ
//0: Đang chờ xử ý
//1: Đã duyệt đơn
//2: Đã hoàn thành
//-2: Không chấp nhận

//Get đơn hàng by Admin

router.get("/byAdmin", verifyTokenAndAdmin, async (req, res) => {
    try {
        //Đã duyệt
        const confirm = req.query.confirm;
        //Đã hoàn thành
        const success = req.query.success;
        //Đã huỷ bởi admin
        const refuse = req.query.refuse;
        //Đã huỷ bởi khách hàng
        const cancel = req.query.cancel;

        const query = `SELECT orders.id, orders.fullname, orders.phone, orders.note, orders.reason, orders.orderDate, orders.status, orders.shipping_address, orders.total_amount, user.email, user.username
                        FROM orders INNER JOIN user ON user.id = orders.id_user
                        WHERE status = ? ORDER BY orders.orderDate DESC`;
        if (confirm) {
            const [order] = await pool.query(query, [1]);
            return res.status(200).json({ success: true, order })
        } else if (success) {
            const [order] = await pool.query(query, [2]);
            return res.status(200).json({ success: true, order })
        } else if (refuse) {
            const [order] = await pool.query(query, [-2]);
            return res.status(200).json({ success: true, order })
        } else if (cancel) {
            const [order] = await pool.query(query, [-1]);
            return res.status(200).json({ success: true, order })
        }
        //Mặc định lấy đơn chờ xử lý
        const [order] = await pool.query(query, [0]);
        return res.status(200).json({ success: true, order })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
    }
})


//Khách hàng huỷ đơn
router.put("/cancel_by_user/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        console.log("red.body.id_order: ", req.body.id);
        const query = `UPDATE orders SET status = ? WHERE id = ?`;
        const [cancelOrder] = await pool.query(query, [-1, req.body.id]);
        console.log(cancelOrder);
        return res.status(200).json({ success: true, message: "Huỷ đơn hàng thành công" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
    }
})

//Admin xử lý đơn
router.put("/byAdmin", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = req.body.id;
        //Xác nhận đơn
        //const confirm = req.query.confirm;
        //Hoàn thành đơn
        const success = req.query.success;
        //Huỷ đơn
        const refuse = req.query.refuse;
        //Hoàn tác huỷ
        const undo = req.query.undo;

        const query = `UPDATE orders SET status = ? WHERE id = ?`;
        console.log({ success, refuse, undo });
        if (success) {
            console.log("success");
            const [handleOrder] = await pool.query(query, [2, id]);
            return res.status(200).json({ success: true, message: "Đơn đã hoàn thành" })
        } else if (refuse) {
            let reason = req.body.reason
            console.log("refuse", reason, id);
            const [detail] = await pool.query(`SELECT * FROM order_detail WHERE id_order = ?`, [id])
            console.log(detail);
            //Admin cancel thì số lượng sản phẩm trở về ban đầu như khi khách chưa đặt
            await updateFiltersQuantitiesByAdminCancel(detail)
            const qr = `UPDATE orders SET status = ?, reason = ? WHERE id = ?`;
            const [handleOrder] = await pool.query(qr, [-2, reason,id]);
            return res.status(200).json({ success: true, message: "Đã huỷ đơn thành công" })
        } else if (undo) {
            console.log("undo");
            let reason = req.body.reason
            const qr = `UPDATE orders SET status = ?, reason = ? WHERE id = ?`;
            //Admin hoàn tác lại thao tác huỷ đơn hàng thì số lươnng sản phẩm sẽ bị giảm đi như khi người dùng đặt
            const [detail] = await pool.query(`SELECT * FROM order_detail WHERE id_order = ?`, [id])
            await updateFiltersQuantities(detail)
            const [handleOrder] = await pool.query(qr, [0, reason,id]);
            return res.status(200).json({ success: true, message: "Đã hoàn tác hành động huỷ đơn" })
        }

        //Mặc định là xác nhận đơn
        console.log("confirm");
        const [handleOrder] = await pool.query(query, [1, id]);
        return res.status(200).json({ success: true, message: "Xác nhận đơn hàng thành công" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
    }
})



module.exports = router