const express = require('express')
const router = express.Router()

const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require('../middleware/verifyToken')


const pool = require('../common/connectDB')

router.post("/search", async (req, res) => {
    // let data = {
    //     sample: {
    //         name: "",
    //         idCategory: "",
    //         idOwner: "",
    //         id: "",
    //     },
    //     pageInfo: {
    //         pageNumber: "",
    //         pageSize: ""
    //     },
    //     orders: {
    //         property: "",
    //         direction: ""
    //     }
    // }
    let {sample, pageInfo, orders} = req.body

    console.log('body', orders?.property);
    try {
        let sql = "SELECT * FROM product WHERE 1=1 "
        + ` AND (${sample?.name ? `upper(name) like UPPER("%${sample?.name}%")` : "1=1"}) `
        + ` AND (${sample?.idCategory ? `id_category = ${sample?.idCategory}` : "1=1"}) `
        + ` AND (${sample?.idOwner ? `id_owner = ${sample?.idOwner}` : "1=1"}) `
        + ` AND (${sample?.id ? `id = ${sample?.id}` : "1=1"})`
        + " AND deleted = 0 "
        + ` ${orders?.property ? `ORDER BY ${orders?.property} ${orders?.direction}` : ""}`
        console.log('check sql', sql);
        let [products] = await pool.execute(sql)
        return res.status(200).json({ success: true, data: products})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


router.get("/page", async (req, res) => {
    try {
        let [page] = await pool.execute(`SELECT CEIL(COUNT(*) / 12) AS numPages FROM product WHERE deleted = ?`, [0])
        return res.status(200).json(page)
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.get("/pageDeleted", async (req, res) => {
    try {
        let [page] = await pool.execute(`SELECT CEIL(COUNT(*) / 12) AS numPages FROM product WHERE deleted = ?`, [1])
        return res.status(200).json(page)
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.get("/search", async (req, res) => {
    try {
        let [products] = await pool.execute(`SELECT * FROM product WHERE name = ? AND deleted = ?`, [req.query.name, 0]);
        return res.status(200).json({ success: true, products})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.get("/detail/:id", async (req, res) => {
    try {
        let [product] = await pool.execute(`SELECT * FROM product WHERE id = ? AND deleted = ?`, [req.params.id, 0]);
        const [sizes] = await pool.execute(`SELECT id,size FROM filter WHERE id_pro=? AND deleted=? GROUP BY size`, [req.params.id, 0])
        const [colors] = await pool.execute(`SELECT id,color,img FROM filter WHERE id_pro=? AND deleted=? GROUP BY color`, [req.params.id, 0])
        // const [imgs] = await pool.execute(`SELECT id, img FROM filter WHERE id_pro=? GROUP BY color`, [req.params.id])
        return res.status(200).json({ success: true, product: product[0], sizes, colors })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


//Get product by Admin
router.get("/byAdmin/", verifyTokenAndAdmin, async (req, res) => {
    const query = `SELECT product.*, category.name AS category, producer.name AS producer
                    FROM product INNER JOIN category ON product.id_category = category.id 
                                INNER JOIN producer ON product.id_owner = producer.id
                    WHERE deleted = ? ORDER BY createAt DESC`


    const qpage = req.query.page;
    if (qpage) {
        let page = Number(qpage)
        let limit = 12;
        let offset = (page - 1) * 12;
        const pageQuery = `SELECT product.*, category.name AS category, producer.name AS producer
                        FROM product INNER JOIN category ON product.id_category = category.id 
                        INNER JOIN producer ON product.id_owner = producer.id
                        WHERE deleted = ? ORDER BY createAt DESC
                        LIMIT ${limit} OFFSET ${offset}`

        let [products] = await pool.execute(pageQuery, [0]);
        return res.status(200).json({ success: true, products })
    }
    let [products] = await pool.execute(query, [0])
    console.log("123");
    return res.status(200).json({ success: true, products, message: "OKKKK" })
})
router.get("/detail-admin/:id", async (req, res) => {
    try {
        let [product] = await pool.execute(`SELECT * FROM product WHERE id = ?`, [req.params.id]);
        const [filter] = await pool.execute(`SELECT * FROM filter WHERE id_pro=? AND deleted=?`, [req.params.id,0])
        return res.status(200).json({ success: true, product: product[0], filter })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

//Get product deleted
//Get product by Admin
router.get("/deleted-byAdmin/", verifyTokenAndAdmin, async (req, res) => {
    const query = `SELECT product.*, category.name AS category, producer.name AS producer
                    FROM product INNER JOIN category ON product.id_category = category.id 
                                INNER JOIN producer ON product.id_owner = producer.id
                    WHERE deleted = ? ORDER BY createAt DESC`


    const qpage = req.query.page;
    if (qpage) {
        let page = Number(qpage)
        let limit = 12;
        let offset = (page - 1) * 12;
        const pageQuery = `SELECT product.*, category.name AS category, producer.name AS producer
                        FROM product INNER JOIN category ON product.id_category = category.id 
                        INNER JOIN producer ON product.id_owner = producer.id
                        WHERE deleted = ? ORDER BY createAt DESC
                        LIMIT ${limit} OFFSET ${offset}`

        let [products] = await pool.execute(pageQuery, [1]);
        return res.status(200).json({ success: true, products })
    }
    let [products] = await pool.execute(query, [1])
    console.log("123");
    return res.status(200).json({ success: true, products, message: "OKKKK" })
})


router.get("/", async (req, res) => {
    const qCategory = req.query.category;
    const qOwner = req.query.producer;
    const qid = req.query.id;
    const qpage = req.query.page;
    console.log({ qCategory, qOwner, qid, qpage });
    try {
        if (qCategory && qpage) {
            let page = Number(qpage)
            let limit = 12;
            let offset = (page - 1) * 12;
            let [products] = await pool.execute(`SELECT * FROM product WHERE id_category = ? AND deleted = ? ORDER BY createAt DESC LIMIT ${limit} OFFSET ${offset}`, [qCategory, 0]);
            return res.status(200).json({ success: true, products })
        }
        else if (qOwner && qpage) {
            let page = Number(qpage)
            let limit = 12;
            let offset = (page - 1) * 12;
            let [products] = await pool.execute(`SELECT * FROM product WHERE id_owner = ? AND deleted = ? ORDER BY createAt DESC LIMIT ${limit} OFFSET ${offset}`, [qOwner, 0]);
            return res.status(200).json({ success: true, products })
        }
        else if (qid) {
            let [product] = await pool.execute(`SELECT * FROM product WHERE id = ? AND deleted = ?`, [qid, 0]);
            return res.status(200).json({ success: true, product: product[0] })
        }
        else if (qpage) {
            let page = Number(qpage)
            let limit = 12;
            let offset = (page - 1) * 12;
            let [products] = await pool.execute(`SELECT * FROM product WHERE deleted = ? ORDER BY createAt DESC LIMIT ${limit} OFFSET ${offset}`, [0]);
            return res.status(200).json({ success: true, products })
        }
        //let [products] = await pool.execute(`SELECT product.*, hangsx.name AS hangSX  FROM product INNER JOIN hangsx ON hangsx.id = product.id_owner`);
        let [products] = await pool.query(`SELECT * FROM product WHERE deleted = ? ORDER BY createAt DESC`, [0]);
        return res.status(200).json({ success: true, products })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const { name, description, information, priceRange, status, img, id_owner, id_category } = req.body

    try {
        const [result] = await pool.query('INSERT INTO product (name, description, information, priceRange, status, img, id_owner, id_category) VALUES (?, ?,?, ?, ?, ?, ?, ?)',
            [name, description, information, Number(priceRange), status, img, Number(id_owner), Number(id_category)]);

        const filters = req.body.filters
        const values1 = filters.map(item => [result.insertId, item.color, item.size, Number(item.quantity), Number(item.price), item.img]);
        const sql = 'INSERT INTO filter (id_pro, color, size, quantity, price, img) VALUES ?';
        const [result1] = await pool.query(sql, [values1]);
        console.log(req.body);
        return res.status(200).json({ success: true, message: "Thêm mới sản phẩm thành công" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
    const { name, description, information, status, img, id_owner, id_category } = req.body

    try {
        const [result] = await pool.execute('UPDATE product SET name = ?, description=?, information=?, status=?, img=?, id_owner=?, id_category=? WHERE id=?',
            [name, description, information, status, img,Number(id_owner), Number(id_category), req.params.id]);
        return res.status(200).json({ success: true, message: "Cập nhật sản phẩm thành công " })
    } catch (error) {
        console.log("error lỗi");
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.get("/count/deleted", verifyTokenAndAdmin, async (req, res) => {
    try {
        let [count] = await pool.execute(`SELECT COUNT(*) AS numberDeleted FROM product WHERE deleted = ?`, [1])
        return res.status(200).json({success: true, count: count[0]})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.put("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
    //const { deleted } = req.body

    try {
        const [result] = await pool.execute('UPDATE product SET deleted=? WHERE id=?',
            [1, req.params.id]);
        return res.status(200).json({ success: true, message: "Xoá sản phẩm thành công " })
    } catch (error) {
        console.log("error lỗi");
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.put("/cancel-delete/:id", verifyTokenAndAdmin, async (req, res) => {
    //const { deleted } = req.body

    try {
        const [result] = await pool.execute('UPDATE product SET deleted=? WHERE id=?',
            [0, req.params.id]);
        return res.status(200).json({ success: true, message: "Khôi phục sản phẩm thành công " })
    } catch (error) {
        console.log("error lỗi");
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


module.exports = router