const express = require('express')
const router = express.Router()

const {verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin} = require('../middleware/verifyToken')


const pool = require('../common/connectDB')


router.get("/", async(req, res) => {
    const qCategory = req.query.category;
    const qOwner = req.query.owner;
    const qid = req.query.id;
    const qpage = req.query.page;

    try {
        if(qCategory){
            let [products] = await pool.execute(`SELECT * FROM product WHERE id_category = ? AND deleted = ? ORDER BY createAt DESC`,[qCategory, 0]);
            return res.status(200).json({success: true, products})
        }
        else if(qOwner){
            let [products] = await pool.execute(`SELECT * FROM product WHERE id_owner = ? AND deleted = ? ORDER BY createAt DESC`,[qOwner, 0]);
            return res.status(200).json({success: true, products})
        }
        else if(qid){
            let [products] = await pool.execute(`SELECT * FROM product WHERE id = ? AND deleted = ? ORDER BY createAt DESC`,[qid], 0);
            return res.status(200).json({success: true, products})
        }
        else if(qpage){
            let page = Number(qpage)
            let limit = 10;
            let offset = (page-1)*10;
            let [products] = await pool.execute(`SELECT * FROM product WHERE deleted = ? ORDER BY createAt DESC LIMIT ${limit} OFFSET ${offset}`, [0]);
            return res.status(200).json({success: true, products})
        }
        //let [products] = await pool.execute(`SELECT product.*, hangsx.name AS hangSX  FROM product INNER JOIN hangsx ON hangsx.id = product.id_owner`);
        let [products] = await pool.query(`SELECT * FROM product WHERE deleted = ? ORDER BY createAt DESC`, [0]);
		return res.status(200).json({success: true, products})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})


router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const {name, description, information, status, img, star, id_owner,	id_category} = req.body
    
    try {
        const [result] = await pool.query('INSERT INTO product (name, description, information, status, img, star, id_owner, id_category) VALUES (?, ?, ?, ?, ?, ?, ? ,?)', 
        [name, description, information, status, img, star, id_owner, id_category]);
        return res.status(200).json({success: true, message: "Thêm mới sản phẩm thành công "})
    } catch (error) {
        console.log("error lỗi");
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})

router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
    const {name, description, information, status, img, star, id_owner,	id_category} = req.body
    
    try {
        const [result] = await pool.execute('UPDATE product SET name = ?, description=?, information=?, status=?, img=?, star=?, id_owner=?, id_category=? WHERE id=?', 
        [name, description, information, status, img, star, id_owner, id_category, req.params.id]);
        return res.status(200).json({success: true, message: "Cập nhật sản phẩm thành công "})
    } catch (error) {
        console.log("error lỗi");
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})

router.put("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
    const {deleted} = req.body
    
    try {
        const [result] = await pool.execute('UPDATE product SET deleted=? WHERE id=?', 
        [deleted, req.params.id]);
        return res.status(200).json({success: true, message: "Xoá sản phẩm thành công "})
    } catch (error) {
        console.log("error lỗi");
        return res.status(500).json({success: false, message: "Internal server error !"})
    }
})


module.exports = router