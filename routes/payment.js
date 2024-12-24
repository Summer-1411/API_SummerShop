const express = require('express')
const router = express.Router()
const crypto = require('crypto');
const axios = require('axios');

const pool = require('../common/connectDB');
const { getBodyHTMLSoldOut, sendMail } = require('../service/emailService');

router.get('/success/:id', async function (req, res) {
    // const status = req.params.status
    try {
        const id = req.params.id
        const sumkey = req.query.sumkey
        const clientId = req.query.clientId

        console.log('success', { id, sumkey, clientId });
        if (!id || !sumkey || !clientId) {
            return res.redirect('/api/payment/render-result/not-found')
        }
        if (sumkey !== process.env.CHECKSUM_KEY || clientId !== process.env.X_CLIENT_ID) {
            return res.redirect('/api/payment/render-result/not-found')
        }
        const [detail] = await pool.query(`SELECT * FROM order_detail WHERE id_order = ?`, [id])
        await updateFiltersQuantities(detail)
        const query = `UPDATE orders SET status = ${1} WHERE id = ${id}`;
        await pool.query(query);
        return res.redirect('/api/payment/render-result/success')

    } catch (error) {
        return res.redirect('/api/payment/render-result/not-found')
    }
});

router.get('/error/:id', async function (req, res) {
    try {
        const id = req.params.id
        const sumkey = req.query.sumkey
        const clientId = req.query.clientId
        console.log('error', { id, sumkey, clientId });
        if (!id || !sumkey || !clientId) {
            return res.redirect('/api/payment/render-result/not-found')
        }
        if (sumkey !== process.env.CHECKSUM_KEY || clientId !== process.env.X_CLIENT_ID) {
            return res.redirect('/api/payment/render-result/not-found')
        }
        const query = `DELETE FROM orders WHERE id = ${id}`;
        await pool.query(query);
        return res.redirect('/api/payment/render-result/error')

    } catch (error) {
        return res.redirect('/api/payment/render-result/not-found')
    }
});






router.get('/render-result/:status', function (req, res) {
    const status = req.params.status
    console.log('status', status);
    if (status === 'success') {
        return res.render('paymentSuccess');
    } else if (status === 'error') {
        return res.render('paymentError');
    }
    return res.render('notFound');
});

router.post("/create-payment/", async (req, res) => {
    try {
        const {
            orderCode,
            amount,
            description,
            buyerName,
            buyerEmail,
            buyerPhone,
            buyerAddress,
            items,
        } = req.body

        console.log('start');
        const cancelUrl = `http://localhost:6868/api/payment/error/${orderCode}?sumkey=${process.env.CHECKSUM_KEY}&clientId=${process.env.X_CLIENT_ID}`
        const returnUrl = `http://localhost:6868/api/payment/success/${orderCode}?sumkey=${process.env.CHECKSUM_KEY}&clientId=${process.env.X_CLIENT_ID}`
        const hash = crypto.createHmac('SHA256', process.env.CHECKSUM_KEY).update(`amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`).digest('hex');
        const payload = {
            ...req.body,
            expiredAt: getExpiredAt(),
            signature: hash,
            cancelUrl: cancelUrl,
            returnUrl: returnUrl,

        };
        const { data: dataResponse } = await axios.post('https://api-merchant.payos.vn/v2/payment-requests', payload, {
            headers: {
                'x-client-id': process.env.X_CLIENT_ID,
                'x-api-key': process.env.X_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log('response.data', dataResponse);
        return res.status(200).json({ success: true, message: "success", data: dataResponse.data.checkoutUrl })
    } catch (error) {
        console.log('errr payment', error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
const getExpiredAt = () => {
    const currentTimestamp = Math.floor((Date.now() + 60 * 10) / 1000);
    const timestampPlus10Minutes = currentTimestamp + (10 * 60);
    return timestampPlus10Minutes;
};

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
        }
    } finally {
        connection.release();
    }
}
module.exports = router