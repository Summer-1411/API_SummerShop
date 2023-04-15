const express = require('express')
const router = express.Router()

const {verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin} = require('../middleware/verifyToken')


const pool = require('../common/connectDB')

//UPDATE USER

router.get("/alluser/", verifyTokenAndAdmin, async(req, res) =>{
    const qid = req.query.id
    try {
        if(qid){
            const [users] = await pool.query(`SELECT * FROM user WHERE id = ?`, [qid]);
            return res.status(200).json({success: true, users})
        }
        const [users] = await pool.query(`SELECT * FROM user`);
        return res.status(200).json({success: true, users})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})


router.put("update/:id", verifyTokenAndAuthorization, async (req, res) => {
    const {username, avatar , birthday} = req.body
    if(!username || !avatar || !birthday){
		return res
		.status(400)
		.json({ success: false, message: 'Missing parameters !' })
	}
    try {
        await pool.execute('UPDATE user SET username = ?, avatar = ?, birthday = ? WHERE id = ?', 
            [username, avatar, birthday, req.params.id])
        return res.status(200).json({success: true, message: "Cập nhật thông tin thành công"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})



//DELETE

router.put("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
    const {deleted} = req.body
    if(!deleted){
		return res
		.status(400)
		.json({ success: false, message: 'Missing parameters !' })
	}
    try {
        await pool.execute('UPDATE user SET deleted = ? WHERE id = ?', 
            [deleted, req.params.id])
        return res.status(200).json({success: true, message: "Xoá user thành công"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})



module.exports = router