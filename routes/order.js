const express = require('express')
const router = express.Router()
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken')

const axios = require('axios');
const pool = require('../common/connectDB');
const { getBodyHTMLSoldOut, sendMail, getBodyHTMLEmailSuccessOrder, getBodyHTMLEmailCancelOrder } = require('../service/emailService');
const LayoutDetail = require('../views/LayoutDetail');
const { sendMailOrder } = require('../service/invoiceService');
const SinglePage = require('../views/SinglePage');
const SinglePageNew = require('../views/SinglePageNew');
const Layout = require('../views/Layout');
//-1: Đơn hàng khách huỷ
//0: Đang chờ xử ý
//1: Đã duyệt đơn
//2: Đã hoàn thành
//-2: Không chấp nhận

//10: Đang chờ thanh toán online

//Khách hàng đặt hàng thì số lượng sản phẩm sẽ giảm đi
async function updateFiltersQuantities(products) {
    const connection = await pool.getConnection();
    try {
        for (const product of products) {
            await connection.query(
                'UPDATE filter SET quantity = quantity - ? WHERE id = ?',
                [product.quantity, product.id_filter]
            );
            let [detailProduct] = await pool.query(`SELECT filter.*,product.name FROM filter INNER join product on filter.id_pro = product.id where filter.id = ?`, [product.id_filter]);
            if (detailProduct.length > 0) {
                if (detailProduct[0].quantity === 0) {
                    let data = {
                        email: 'levantung14112002@gmail.com',
                        subject: "Thông báo từ hệ thống kho bán hàng",
                        html: getBodyHTMLSoldOut({
                            name: detailProduct[0].name,
                            color: detailProduct[0].color,
                            size: detailProduct[0].size,
                        })
                    }
                    await sendMail(data)
                }
            }

            console.log(detailProduct[0]);
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

//-1: Đơn hàng khách huỷ
//0: Đang chờ xử ý
//1: Đã duyệt đơn
//2: Đã hoàn thành
//-2: Không chấp nhận

//10: Đang chờ thanh toán online


router.post('/', verifyToken, async (req, res) => {
    try {
        const {
            fullname,
            phone,
            address,
            methodShip,
            total,
            note,
            paymentMethod, // 1 khi nhận hàng - 2 online
            voucherValue,
        } = req.body;

        const statusOrder = paymentMethod === '1' ? 0 : 10 // status = 0, chờ xác nhận đơn thanh toán khi nhận hàng, status = 10 : chờ xử lý payment
        const query = `INSERT INTO orders (id_user, fullname, phone, shipping_address, shipping_method, total_amount, note, payment_method, voucherValue, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        const [result] = await pool.query(query
            , [req.user.id, fullname, phone, address, methodShip, total, note, paymentMethod, voucherValue, statusOrder]);

        const orderId = result.insertId
        const products = req.body.products
        const values1 = products.map(item => [result.insertId, item.id_filter, item.quantity, item.price]);
        await updateFiltersQuantities(products)
        const sql = 'INSERT INTO order_detail (id_order, id_filter, quantity, price) VALUES ?';
        const [result1] = await pool.query(sql, [values1]);
        if (paymentMethod === '1') {
            return res.status(200).json({ success: true, message: 'Đặt hàng thành công' })

        }
        else if (paymentMethod === '2') {
            console.log('check');
            const payload = {
                orderCode: result.insertId,
                amount: req.body.total,
                description: `DON HANG ${result.insertId}`,
                buyerName: fullname,
                buyerEmail: '',
                buyerPhone: phone,
                buyerAddress: address,
                items: products,

            }
            const { data: dataResponse } = await axios.post('http://localhost:6868/api/payment/create-payment', payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('link', dataResponse.data)
            //  res.redirect(dataResponse.data)
            return res.status(200).json({ success: true, message: 'Đặt hàng thành công', redirectUrl: dataResponse.data })

        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
    }
})

router.get("/cancel-payment/:id", async (req, res) => {
    try {
        const id = req.params.id
        // const [order] = await pool.query(`DELETE FROM orders WHERE id = ?`, [id]);
        // res.json({ success: true, message: "Giỏ hàng trống"})
        return res.redirect('http://localhost:3001/')
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
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

        const query = `SELECT orders.id, orders.fullname, orders.phone, orders.orderDate, orders.status, orders.note, 
                        orders.reason, orders.shipping_address, orders.total_amount, orders.voucherValue, orders.payment_method
                        FROM orders
                        WHERE id_user = ? AND orders.status = ? ORDER BY orders.orderDate DESC`;

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


        const query = `SELECT orders.id, orders.id_user,orders.fullname, orders.phone, orders.note, orders.reason, orders.orderDate, orders.status, orders.payment_method, orders.shipping_address, orders.voucherValue,orders.total_amount, user.email, user.username
                        FROM orders INNER JOIN user ON user.id = orders.id_user
                        WHERE orders.status = ? ORDER BY orders.orderDate DESC`;
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
router.put("/manager-order", verifyTokenAndAdmin, async (req, res) => {
    try {
        //Hoàn thành đơn
        const success = req.query.success;
        //Huỷ đơn
        const refuse = req.query.refuse;
        //Hoàn tác huỷ
        const undo = req.query.undo;
        const detailOrder = req.body
        const { id, id_user, fullName, user } = detailOrder
        const { email, username } = user
        const options = { format: 'Letter' };
        const query = `UPDATE orders SET status = ? WHERE id = ?`;
        if (success) {
            await pool.query(query, [2, id]);
            const htmlContent = LayoutDetail(getBodyHTMLEmailSuccessOrder(fullName), SinglePageNew(detailOrder))
            const subject = "Đơn hàng của bạn đã được giao thành công"
            sendMailOrder(options, { email, subject, htmlContent })
            return res.status(200).json({ success: true, message: "Đơn đã hoàn thành" })
        } else if (refuse) {
            let reason = req.body.reason
            const [detail] = await pool.query(`SELECT * FROM order_detail WHERE id_order = ?`, [id])

            //Admin cancel thì số lượng sản phẩm trở về ban đầu như khi khách chưa đặt
            await updateFiltersQuantitiesByAdminCancel(detail)
            const qr = `UPDATE orders SET status = ?, reason = ? WHERE id = ?`;
            await pool.query(qr, [-2, reason, id]);
            const htmlContent = LayoutDetail(getBodyHTMLEmailCancelOrder({ fullName, reason }), SinglePageNew(detailOrder))
            const subject = "Đơn hàng của bạn đã bị hủy"
            sendMailOrder(options, { email, subject, htmlContent })
            return res.status(200).json({ success: true, message: "Đã huỷ đơn thành công" })
        } else if (undo) {
            const qr = `UPDATE orders SET status = ?, reason = ? WHERE id = ?`;
            //Admin hoàn tác lại thao tác huỷ đơn hàng thì số lươnng sản phẩm sẽ bị giảm đi như khi người dùng đặt
            const [detail] = await pool.query(`SELECT * FROM order_detail WHERE id_order = ?`, [id])
            await updateFiltersQuantities(detail)
            await pool.query(qr, [0, '', id]);
            return res.status(200).json({ success: true, message: "Đã hoàn tác hành động huỷ đơn" })
        }

        //Mặc định là xác nhận đơn
        await pool.query(query, [1, id]);
        const htmlContent = Layout(SinglePageNew(detailOrder))
        const subject = "Đơn hàng của bạn đã được duyệt. Sau đây là thông tin hóa đơn của bạn, chúc bạn một ngày tốt lành !"
        sendMailOrder(options, { email, subject, htmlContent })
        return res.status(200).json({ success: true, message: "Xác nhận đơn hàng thành công" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
    }
})

//Admin xử lý đơn
router.put("/byAdmin", verifyTokenAndAdmin, async (req, res) => {
    try {
        //Hoàn thành đơn
        const success = req.query.success;
        //Huỷ đơn
        const refuse = req.query.refuse;
        //Hoàn tác huỷ
        const undo = req.query.undo;

        // {
        //     "id": 76,
        //     "id_user": 47,
        //     "fullname": "tung le van",
        //     "phone": "098765432",
        //     "status": 0,
        //     "reason": null,
        //     "orderDate": "2024-06-11T23:50:47.000Z",
        //     "shipping_address": "số 1, Phường Châu Khê, Thành phố Từ Sơn, Tỉnh Bắc Ninh",
        //     "shipping_method": "Giao hàng",
        //     "payment_method": "1",
        //     "total_amount": 11000000,
        //     "note": null,
        //     "voucherValue": 0,
        //     "user": {
        //         "email": "hvtuantvtc@gmail.com",
        //         "username": "hvtuantvtc@gmail.com"
        //     },
        //     "order_detail": [
        //         {
        //             "id": 122,
        //             "id_order": 76,
        //             "id_filter": 40,
        //             "quantity": 1,
        //             "price": 0,
        //             "filter": {
        //                 "id": 40,
        //                 "id_pro": 28,
        //                 "color": "Đen",
        //                 "size": "256GB",
        //                 "quantity": 30,
        //                 "img": "1684229743235Đen.jpg",
        //                 "price": 11000000,
        //                 "status": 0,
        //                 "product": {
        //                     "name": "iPhone 11 Chính hãng VN/A"
        //                 }
        //             }
        //         }
        //     ]
        // }


        // {
        //     "id": 76,
        //     "id_user": 47,
        //     "fullname": "tung le van",
        //     "phone": "098765432",
        //     "note": null,
        //     "reason": null,
        //     "orderDate": "11/06/2024 23:50",
        //     "status": 0,
        //     "payment_method": "1",
        //     "shipping_address": "số 1, Phường Châu Khê, Thành phố Từ Sơn, Tỉnh Bắc Ninh",
        //     "voucherValue": "0 ₫",
        //     "total_amount": "11.000.000 ₫",
        //     "email": "hvtuantvtc@gmail.com",
        //     "username": "hvtuantvtc@gmail.com",
        //     "userId": 47,
        //     "fullName": "tung le van",
        //     "products": [
        //         {
        //             "id_pro": 28,
        //             "id": 122,
        //             "id_filter": 40,
        //             "quantity": 1,
        //             "size": "256GB",
        //             "img": "1684229743235Đen.jpg",
        //             "color": "Đen",
        //             "price": "0 ₫",
        //             "name": "iPhone 11 Chính hãng VN/A",
        //             "category": "256GB - Đen",
        //             "total": "0 ₫"
        //         }
        //     ]
        // }
        const detailOrder = req.body
        const { id, userId, email, fullName } = detailOrder
        const options = { format: 'Letter' };
        const query = `UPDATE orders SET status = ? WHERE id = ?`;
        if (success) {
            await pool.query(query, [2, id]);
            const htmlContent = LayoutDetail(getBodyHTMLEmailSuccessOrder(fullName), SinglePage(detailOrder))
            const subject = "Đơn hàng của bạn đã được giao thành công"
            sendMailOrder(options, { email, subject, htmlContent })
            return res.status(200).json({ success: true, message: "Đơn đã hoàn thành" })
        } else if (refuse) {
            let reason = req.body.reason
            const [detail] = await pool.query(`SELECT * FROM order_detail WHERE id_order = ?`, [id])

            //Admin cancel thì số lượng sản phẩm trở về ban đầu như khi khách chưa đặt
            await updateFiltersQuantitiesByAdminCancel(detail)
            const qr = `UPDATE orders SET status = ?, reason = ? WHERE id = ?`;
            await pool.query(qr, [-2, reason, id]);
            const htmlContent = LayoutDetail(getBodyHTMLEmailCancelOrder({ fullName, reason }), SinglePage(detailOrder))
            const subject = "Đơn hàng của bạn đã bị hủy"
            sendMailOrder(options, { email, subject, htmlContent })
            return res.status(200).json({ success: true, message: "Đã huỷ đơn thành công" })
        } else if (undo) {
            const qr = `UPDATE orders SET status = ?, reason = ? WHERE id = ?`;
            console.log('id', id)
            //Admin hoàn tác lại thao tác huỷ đơn hàng thì số lươnng sản phẩm sẽ bị giảm đi như khi người dùng đặt
            const [detail] = await pool.query(`SELECT * FROM order_detail WHERE id_order = ?`, [id])
            await updateFiltersQuantities(detail)
            await pool.query(qr, [0, '', id]);
            return res.status(200).json({ success: true, message: "Đã hoàn tác hành động huỷ đơn" })
        }

        //Mặc định là xác nhận đơn
        await pool.query(query, [1, id]);
        return res.status(200).json({ success: true, message: "Xác nhận đơn hàng thành công" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Có lỗi xảy ra trong quá trình xử lý !' })
    }
})



module.exports = router