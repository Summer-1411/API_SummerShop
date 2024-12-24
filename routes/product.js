const express = require('express')
const router = express.Router()

const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin } = require('../middleware/verifyToken')


const pool = require('../common/connectDB')
const { hasValue } = require('../utils')

router.get("/check", async (req, res) => {

    try {
        return res.redirect('http://localhost:5173')
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.post("/search", async (req, res) => {
    let { sample, orders } = req.body
    try {
        let sql = "SELECT * FROM product WHERE 1=1 "
            + ` AND (${sample?.name ? `upper(name) like UPPER("%${sample?.name}%")` : "1=1"}) `
            + ` AND (${sample?.idCategory ? `id_category = ${sample?.idCategory}` : "1=1"}) `
            + ` AND (${sample?.idProducer ? `id_producer = ${sample?.idProducer}` : "1=1"}) `
            + ` AND (${sample?.id ? `id = ${sample?.id}` : "1=1"})`
            + " AND status = 1 "
            + ` ${orders?.property ? `ORDER BY ${orders?.property} ${orders?.direction}` : ""}`
        let [products] = await pool.execute(sql)
        return res.status(200).json({ success: true, data: products })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})




router.post("/search-admin", async (req, res) => {
    let { sample, orders } = req.body
    try {
        let sql = "SELECT * FROM product WHERE 1=1 "
            + ` AND (${sample?.name ? `upper(name) like UPPER("%${sample?.name}%")` : "1=1"}) `
            + ` AND (${sample?.idCategory ? `id_category = ${sample?.idCategory}` : "1=1"}) `
            + ` AND (${sample?.idProducer ? `id_producer = ${sample?.idProducer}` : "1=1"}) `
            + ` AND (${sample?.id ? `id = ${sample?.id}` : "1=1"})`
            + ` AND (${hasValue(sample?.status) ? `status = ${sample?.status}` : "1=1"})`
            + ` ${orders?.property ? `ORDER BY ${orders?.property} ${orders?.direction}` : ""}`
        let [products] = await pool.execute(sql)
        console.log('sql', sql);

        return res.status(200).json({ success: true, data: products })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

// {
//     "id": 48,
//     "name": "Sản phẩm 1",
//     "description": "Mô tả 1",
//     "information": "Thông tin 1",
//     "priceRange": 10000000,
//     "qualityGrade": "Tốt, còn bảo hành",
//     "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731348882/qzhclg74y8si4smzrle1.png",
//     "star": 5,
//     "id_producer": 1,
//     "id_category": 1,
//     "createAt": "2024-11-11T18:17:35.000Z",
//     "updateAt": "2024-11-11T18:17:35.000Z",
//     "status": 1,
//     "productDetail": [
//         {
//             "id": 187,
//             "color": "Black",
//             "size": "64GB",
//             "quantity": 12,
//             "price": 1000000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731348927/frwoywcco9tzzz8cohgb.png"
//         },
//         {
//             "id": 188,
//             "color": "Black",
//             "size": "128GB",
//             "quantity": 15,
//             "price": 1200000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731348927/frwoywcco9tzzz8cohgb.png"
//         },
//         {
//             "id": 189,
//             "color": "Black",
//             "size": "256GB",
//             "quantity": 32,
//             "price": 1500000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731348927/frwoywcco9tzzz8cohgb.png"
//         },
//         {
//             "id": 190,
//             "color": "White",
//             "size": "512GB",
//             "quantity": 12,
//             "price": 200000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731349010/y1kzojwlx9whq8w3fopl.png"
//         },
//         {
//             "id": 191,
//             "color": "White",
//             "size": "1TB",
//             "quantity": "205",
//             "price": 240000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731349010/y1kzojwlx9whq8w3fopl.png"
//         },
//         {
//             "id": 192,
//             "color": "White",
//             "size": "2TB",
//             "quantity": "95",
//             "price": 300000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731349010/y1kzojwlx9whq8w3fopl.png"
//         },
//         {
//             "color": "Red",
//             "size": "2TB",
//             "quantity": "95",
//             "price": 300000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731349010/y1kzojwlx9whq8w3fopl.png"
//         }
//     ]
// }

router.get("/page", async (req, res) => {
    try {
        let [page] = await pool.execute(`SELECT CEIL(COUNT(*) / 12) AS numPages FROM product WHERE status = ?`, [1])
        return res.status(200).json(page)
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.get("/pagestatus", async (req, res) => {
    try {
        let [page] = await pool.execute(`SELECT CEIL(COUNT(*) / 12) AS numPages FROM product WHERE status = ?`, [0])
        return res.status(200).json(page)
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.get("/search", async (req, res) => {
    try {

        let [products] = await pool.execute(`SELECT * FROM product WHERE upper(name) like UPPER("%${req.query.name}%") AND status = ?`, [1]);
        return res.status(200).json({ success: true, products })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.get("/detail/:id", async (req, res) => {
    try {
        let [product] = await pool.query(`SELECT * FROM product WHERE id = ? AND status = ?`, [req.params.id, 1]);
        const [sizes] = await pool.query(`SELECT DISTINCT size FROM filter WHERE id_pro=? AND status=?`, [req.params.id, 1])
        const [colors] = await pool.query(`SELECT DISTINCT color FROM filter WHERE id_pro=? AND status=?`, [req.params.id, 1])
        const [imgs] = await pool.query(`SELECT DISTINCT img FROM filter WHERE id_pro=? AND status=?`, [req.params.id, 1])
        // const [imgs] = await pool.execute(`SELECT id, img FROM filter WHERE id_pro=? GROUP BY color`, [req.params.id])
        return res.status(200).json({ success: true, product: product[0], sizes, colors, imgs })
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
                    WHERE status = ? ORDER BY createAt DESC`


    const qpage = req.query.page;
    if (qpage) {
        let page = Number(qpage)
        let limit = 12;
        let offset = (page - 1) * 12;
        const pageQuery = `SELECT product.*, category.name AS category, producer.name AS producer
                        FROM product INNER JOIN category ON product.id_category = category.id 
                        INNER JOIN producer ON product.id_producer = producer.id
                        WHERE product.status = ? ORDER BY product.createAt DESC
                        LIMIT ${limit} OFFSET ${offset}`

        let [products] = await pool.execute(pageQuery, [1]);
        return res.status(200).json({ success: true, products })
    }
    let [products] = await pool.execute(query, [1])
    console.log("123");
    return res.status(200).json({ success: true, products, message: "OKKKK" })
})
router.get("/detail-admin/:id", async (req, res) => {
    try {
        let [product] = await pool.execute(`SELECT * FROM product WHERE id = ?`, [req.params.id]);
        const [filter] = await pool.execute(`SELECT * FROM filter WHERE id_pro=? AND status=?`, [req.params.id, 1])
        return res.status(200).json({ success: true, product: product[0], filter })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

//Get product status
//Get product by Admin
router.get("/status-byAdmin/", verifyTokenAndAdmin, async (req, res) => {
    const query = `SELECT product.*, category.name AS category, producer.name AS producer
                    FROM product INNER JOIN category ON product.id_category = category.id 
                                INNER JOIN producer ON product.id_owner = producer.id
                    WHERE status = ? ORDER BY createAt DESC`


    const qpage = req.query.page;
    if (qpage) {
        let page = Number(qpage)
        let limit = 12;
        let offset = (page - 1) * 12;
        const pageQuery = `SELECT product.*, category.name AS category, producer.name AS producer
                        FROM product INNER JOIN category ON product.id_category = category.id 
                        INNER JOIN producer ON product.id_owner = producer.id
                        WHERE status = ? ORDER BY createAt DESC
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
            let [products] = await pool.execute(`SELECT * FROM product WHERE id_category = ? AND status = ? ORDER BY createAt DESC LIMIT ${limit} OFFSET ${offset}`, [qCategory, 1]);
            return res.status(200).json({ success: true, products })
        }
        else if (qOwner && qpage) {
            let page = Number(qpage)
            let limit = 12;
            let offset = (page - 1) * 12;
            let [products] = await pool.execute(`SELECT * FROM product WHERE id_owner = ? AND status = ? ORDER BY createAt DESC LIMIT ${limit} OFFSET ${offset}`, [qOwner, 1]);
            return res.status(200).json({ success: true, products })
        }
        else if (qid) {
            let [product] = await pool.execute(`SELECT * FROM product WHERE id = ? AND status = ?`, [qid, 1]);
            return res.status(200).json({ success: true, product: product[0] })
        }
        else if (qpage) {
            let page = Number(qpage)
            let limit = 12;
            let offset = (page - 1) * 12;
            let [products] = await pool.execute(`SELECT * FROM product WHERE status = ? ORDER BY createAt DESC LIMIT ${limit} OFFSET ${offset}`, [1]);
            return res.status(200).json({ success: true, products })
        }
        //let [products] = await pool.execute(`SELECT product.*, hangsx.name AS hangSX  FROM product INNER JOIN hangsx ON hangsx.id = product.id_owner`);
        let [products] = await pool.query(`SELECT * FROM product WHERE status = ? ORDER BY createAt DESC`, [1]);
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

router.post("/create-update", verifyTokenAndAdmin, async (req, res) => {
    const { name, description, information, priceRange, qualityGrade, img, id_producer, id_category } = req.body
    const productDetail = req.body.productDetail
    try {
        const [result] = await pool.query('INSERT INTO product (name, description, information, priceRange, qualityGrade, img, id_producer, id_category) VALUES (?, ?,?, ?, ?, ?, ?, ?)',
            [name, description, information, Number(priceRange), qualityGrade, img, Number(id_producer), Number(id_category)]);
        const values1 = productDetail.map(item => [result.insertId, item.color, item.size, Number(item.quantity), Number(item.price), item.img]);
        const sql = 'INSERT INTO filter (id_pro, color, size, quantity, price, img) VALUES ?';
        const [result1] = await pool.query(sql, [values1]);
        console.log(req.body);
        console.log('result', result);

        return res.status(200).json({ success: true, message: "Thêm mới sản phẩm thành công" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


// {
//     "name": "Sản phẩm 1",
//     "description": "Mô tả 1",
//     "information": "Thông tin 1",
//     "priceRange": "12.000.000",
//     "qualityGrade": "Đẹp, tốt",
//     "id_category": 1,
//     "id_producer": 1,
//     "productDetail": [
//         {
//             "color": "Black",
//             "size": "128",
//             "quantity": "20",
//             "price": 200000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731347831/w5qhrq77rzhapcnxso8m.png"
//         },
//         {
//             "color": "Black",
//             "size": "256",
//             "quantity": "28",
//             "price": 230000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731347831/w5qhrq77rzhapcnxso8m.png"
//         },
//         {
//             "color": "Black",
//             "size": "512",
//             "quantity": "30",
//             "price": 500000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731347831/w5qhrq77rzhapcnxso8m.png"
//         },
//         {
//             "color": "White",
//             "size": "64",
//             "quantity": "10",
//             "price": 90000,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731347898/sn29kokqthakzm7owp3i.png"
//         },
//         {
//             "color": "White",
//             "size": "256",
//             "quantity": "12",
//             "price": 299999,
//             "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731347898/sn29kokqthakzm7owp3i.png"
//         }
//     ],
//     "img": "http://res.cloudinary.com/drkmrlmla/image/upload/v1731347768/eqwthsdsxdyhkuxwvdn0.png"
// }

router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
    const { name, description, information, status, img, id_owner, id_category } = req.body

    try {
        const [result] = await pool.execute('UPDATE product SET name = ?, description=?, information=?, status=?, img=?, id_owner=?, id_category=? WHERE id=?',
            [name, description, information, status, img, Number(id_owner), Number(id_category), req.params.id]);
        return res.status(200).json({ success: true, message: "Cập nhật sản phẩm thành công " })
    } catch (error) {
        console.log("error lỗi");
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.get("/count/status", verifyTokenAndAdmin, async (req, res) => {
    try {
        let [count] = await pool.execute(`SELECT COUNT(*) AS numberstatus FROM product WHERE status = ?`, [1])
        return res.status(200).json({ success: true, count: count[0] })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.put("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
    //const { status } = req.body

    try {
        const [result] = await pool.execute('UPDATE product SET status=? WHERE id=?',
            [0, req.params.id]);
        return res.status(200).json({ success: true, message: "Xoá sản phẩm thành công " })
    } catch (error) {
        console.log("error lỗi");
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.put("/cancel-delete/:id", verifyTokenAndAdmin, async (req, res) => {
    //const { status } = req.body

    try {
        const [result] = await pool.execute('UPDATE product SET status=? WHERE id=?',
            [1, req.params.id]);
        return res.status(200).json({ success: true, message: "Khôi phục sản phẩm thành công " })
    } catch (error) {
        console.log("error lỗi");
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


module.exports = router