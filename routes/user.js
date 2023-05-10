const express = require('express')
const router = express.Router()

const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require('../middleware/verifyToken')


const pool = require('../common/connectDB')

router.get("/page", async(req, res) => {
    try {
        let [page] = await pool.execute(`SELECT CEIL(COUNT(*) / 5) AS numPages FROM user WHERE deleted = ?`, [0])
        return res.status(200).json(page)
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})
router.get("/pageDeleted", async(req, res) => {
    try {
        let [page] = await pool.execute(`SELECT CEIL(COUNT(*) / 5) AS numPages FROM user WHERE deleted = ?`, [1])
        return res.status(200).json(page)
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})
router.get("/count/deleted", verifyTokenAndAdmin, async (req, res) => {
    try {
        let [count] = await pool.execute(`SELECT COUNT(*) AS numberDeleted FROM user WHERE deleted = ?`, [1])
        return res.status(200).json({success: true, count: count[0]})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.get("/alluser/", verifyTokenAndAdmin, async (req, res) => {
    const qid = req.query.id
    const qpage = req.query.page
    try {
        if (qid) {
            const [users] = await pool.query(`SELECT * FROM user WHERE id = ?`, [qid]);
            // const [countSuccess] = await pool.query(`SELECT COUNT(*) as number FROM orders WHERE id_user = ? AND status = ? GROUP BY id_user`, [qid, 2]);
            // const [countCancel] = await pool.query(`SELECT COUNT(*) as number FROM orders WHERE id_user = ? AND status = ? GROUP BY id_user`, [qid, -1]);
            return res.status(200).json({ success: true, users})
        }else if(qpage){
            let page = Number(qpage)
            let limit = 5;
            let offset = (page-1)*5;
            let [users] = await pool.execute(`SELECT * FROM user WHERE deleted = ? AND isAdmin = ? ORDER BY createAt DESC LIMIT ${limit} OFFSET ${offset}`, [0, 0]);
            return res.status(200).json({success: true, users})
        }

        const [users] = await pool.query(`SELECT * FROM user WHERE deleted = ? AND isAdmin = ? ORDER BY createAt DESC`, [0, 0]);
        return res.status(200).json({ success: true, users })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra trong quá trình xử lý !" })
    }
})

router.get("/deleted/", verifyTokenAndAdmin, async (req, res) => {
    const qid = req.query.id
    const qpage = req.query.page
    try {
        if (qid) {
            const [users] = await pool.query(`SELECT * FROM user WHERE id = ?`, [qid]);
            // const [countSuccess] = await pool.query(`SELECT COUNT(*) as number FROM orders WHERE id_user = ? AND status = ? GROUP BY id_user`, [qid, 2]);
            // const [countCancel] = await pool.query(`SELECT COUNT(*) as number FROM orders WHERE id_user = ? AND status = ? GROUP BY id_user`, [qid, -1]);
            return res.status(200).json({ success: true, users})
        }else if(qpage){
            let page = Number(qpage)
            let limit = 5;
            let offset = (page-1)*5;
            let [users] = await pool.execute(`SELECT * FROM user WHERE deleted = ? AND isAdmin = ? ORDER BY createAt DESC LIMIT ${limit} OFFSET ${offset}`, [1, 0]);
            return res.status(200).json({success: true, users})
        }

        const [users] = await pool.query(`SELECT * FROM user WHERE deleted = ? AND isAdmin = ? ORDER BY createAt DESC`, [1, 0]);
        return res.status(200).json({ success: true, users })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra trong quá trình xử lý !" })
    }
})


router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
    const { username, avatar, gender, birthday } = req.body

    const values = [];
    if (username) values.push(`username='${username}'`);
    if (avatar) values.push(`avatar='${avatar}'`);
    if (gender) values.push(`gender='${gender}'`);
    if (birthday) values.push(`birthday='${birthday}'`);

    try {
        await pool.execute(
            `UPDATE user SET ${values.join(", ")} WHERE id = ?`,
            [req.params.id]
        );
        console.log(req.body);
        return res.status(200).json({ success: true, message: "Cập nhật thông tin thành công" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra trong quá trình xử lý !" })
    }
})



//DELETE

router.put("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
    //const { deleted } = req.body
    // if (!deleted) {
    //     return res
    //         .status(400)
    //         .json({ success: false, message: 'Missing parameters !' })
    // }
    try {
        await pool.execute('UPDATE user SET deleted = ? WHERE id = ?',
            [1, req.params.id])
        return res.status(200).json({ success: true, message: "Xoá user thành công" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra trong quá trình xử lý !" })
    }
})

//Khôi phục user 
router.put("/cancel-delete/:id", verifyTokenAndAdmin, async (req, res) => {
    // const { deleted } = req.body
    // if (!deleted) {
    //     return res
    //         .status(400)
    //         .json({ success: false, message: 'Missing parameters !' })
    // }
    try {
        await pool.execute('UPDATE user SET deleted = ? WHERE id = ?',
            [0, req.params.id])
        return res.status(200).json({ success: true, message: "Khôi phục user thành công" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra trong quá trình xử lý !" })
    }
})



module.exports = router