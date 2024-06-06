const express = require('express')
const router = express.Router()
const { format } = require('date-fns');
const pool = require('../common/connectDB');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');


router.get('/', async (req, res) => {
	try {
		const [category] = await pool.execute(`SELECT * FROM category`);
		if (category.length === 0)
			return res.status(200).json({ success: false, category: [] })
		return res.json({ success: true, category })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/search', async (req, res) => {
	try {
		let data = req.body
		let sql = "SELECT * FROM category WHERE 1=1"
			+ ` AND (${data?.name ? `upper(name) like UPPER("%${data?.name}%")` : "1=1"}) `
			+ ` AND (${data?.status === 1 || data?.status === 0 ? `status = ${data?.status}` : "1=1"}) `
		const [category] = await pool.execute(sql);
		if (category.length === 0)
			return res.status(200).json({ success: false, category: [] })
		return res.json({ success: true, category })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/create', verifyTokenAndAdmin, async (req, res) => {
	const { name } = req.body
	try {
		const [result] = await pool.query('INSERT INTO category (name) VALUES (?)',
			[name]);
		return res.status(200).json({ success: true, message: "Thêm mới loại sản phẩm thành công", id: result.insertId })
	} catch (error) {
		console.log("error lỗi");
		return res.status(500).json({ success: false, message: "Internal server error !" })
	}
})

router.post('/update/:id', verifyTokenAndAdmin, async (req, res) => {
	const { name, status } = req.body
	try {
		let currentDateTime = format(new Date(), 'yyyy-MM-dd');
		await pool.execute('UPDATE category SET name = ?, status=?, updateAt=? WHERE id=?',
			[name, status, currentDateTime, req.params.id]);
		return res.status(200).json({ success: true, message: "Cập nhật thành công" })
	} catch (error) {
		console.log("error lỗi");
		return res.status(500).json({ success: false, message: "Internal server error !" })
	}
})

router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
	try {
		let currentDateTime = format(new Date(), 'yyyy-MM-dd');
		await pool.execute('UPDATE category SET status=?, updateAt=? WHERE id=?',
			[0, currentDateTime, req.params.id]);
		return res.status(200).json({ success: true, message: "Xóa thành công" })
	} catch (error) {
		console.log("error lỗi");
		return res.status(500).json({ success: false, message: "Internal server error !" })
	}
})



module.exports = router