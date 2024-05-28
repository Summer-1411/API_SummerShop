const express = require('express')
const router = express.Router()
const { format } = require('date-fns');
const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require('../middleware/verifyToken')


const pool = require('../common/connectDB')


//Gửi đánh giá
router.post('/create/', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { idProduct, idOrder, description, rate, img } = req.body

    try {
        const [result] = await pool.query('INSERT INTO feedback (id_user, id_product, id_order, rate, description, img) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, idProduct, idOrder, Number(rate), description, img]);
        return res.status(200).json({ success: true, message: "Bạn đã gửi đánh giá thành công" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


//Sửa đánh giá theo id đánh giá
router.put('/update/:id', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const id = req.params.id
    const { description, rate, img } = req.body

    try {
        const [result] = await pool.query('SELECT * FROM feedback WHERE id = ?',
            [id]);

        if (result.length === 0) {
            return res.status(400).json({ success: false, message: "Bài đánh giá không tồn tại !" })
        }
        if (result[0].id_user !== userId) {
            return res.status(403).json({ success: false, message: "Bạn không có quyền thực hiện !" })
        }
        currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const [update] = await pool.execute('UPDATE feedback SET rate = ?, description=?, img=?, updateAt=? WHERE id=?',
        [rate, description, img, currentDateTime, id]);
        return res.status(200).json({ success: true, message: "Bạn đã gửi đánh giá thành công" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

//Get đánh giá sản phẩm
router.get('/by-product/:id', async (req, res) => {

    try {
        let [feedbacks] = await pool.execute(`SELECT fb.*, u.email, u.avatar, u.username FROM feedback fb INNER JOIN user u ON fb.id_user = u.id WHERE id_product = ?`, [req.params.id]);
        return res.status(200).json({ success: true, data: feedbacks })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


//Get đánh giá sản phẩm
router.get('/by-user/', verifyToken, async (req, res) => {
    const userId = req.user.id;
    console.log('userId', userId);
    try {
        let [feedbacks] = await pool.execute(`SELECT * FROM feedback WHERE id_user = ?`, [userId]);
        return res.status(200).json({ success: true, data: feedbacks })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


module.exports = router