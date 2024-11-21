const express = require('express')
const router = express.Router()
const { format } = require('date-fns');
const pool = require('../common/connectDB');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');


router.get('/', async (req, res) => {
	try {

		const [producer] = await pool.execute(`SELECT * FROM producer`);
		if (producer.length === 0)
			return res.status(200).json({ success: false, producer: [] })
		return res.status(200).json({ success: true, producer })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/search', async (req, res) => {
	try {
		let data = req.body
		console.log('data', data);
		let sql = "SELECT * FROM producer WHERE 1=1"
			+ ` AND (${data?.name ? `upper(name) like UPPER("%${data?.name}%")` : "1=1"}) `
			+ ` AND (${data?.status === 1 || data?.status === 0 ? `status = ${data?.status}` : "1=1"}) `

		console.log('sql', sql);
		const [producer] = await pool.execute(sql);
		if (producer.length === 0)
			return res.status(200).json({ success: false, producer: [] })
		return res.status(200).json({ success: true, producer })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ success: false, message: 'Internal server error' })
	}
})

router.post('/create', verifyTokenAndAdmin, async (req, res) => {
	const { name } = req.body
	try {
		const [result] = await pool.query('INSERT INTO producer (name) VALUES (?)',
			[name]);
		return res.status(200).json({ success: true, message: "Thêm mới hãng sản xuất thành công", id: result.insertId })
	} catch (error) {
		console.log("error lỗi");
		return res.status(500).json({ success: false, message: "Internal server error !" })
	}
})

router.post('/update/:id', verifyTokenAndAdmin, async (req, res) => {
	const { name, status } = req.body
	try {
		let currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
		await pool.execute('UPDATE producer SET name = ?, status=?, updateAt=? WHERE id=?',
			[name, status, currentDateTime, req.params.id]);
		return res.status(200).json({ success: true, message: "Cập nhật thành công" })
	} catch (error) {
		console.log("error lỗi");
		return res.status(500).json({ success: false, message: "Internal server error !" })
	}
})

router.delete('/delete/:id', verifyTokenAndAdmin, async (req, res) => {
	try {
		let currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
		await pool.execute('UPDATE producer SET status=?, updateAt=? WHERE id=?',
			[0, currentDateTime, req.params.id]);
		return res.status(200).json({ success: true, message: "Xóa thành công" })
	} catch (error) {
		console.log("error lỗi", error);
		return res.status(500).json({ success: false, message: "Internal server error !" })
	}
})


module.exports = router