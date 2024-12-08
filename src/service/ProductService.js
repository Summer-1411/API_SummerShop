// src/services/ProductService.js
const vi = require("../messages/message_vi");
const productRepository = require('../repository/ProductRepository');
const filterRepository = require('../repository/FilterRepository');
const fireBaseTokenRepository = require('../repository/FirebaseTokenRepository');
const { sendNotifyToUsers } = require("../firebase/notify");

class ProductService {
    static async create(req, res) {
        const { name, description, information, priceRange, qualityGrade, img, id_producer, id_category, productDetail } = req.body;
        try {
            const productData = {
                name,
                description,
                information,
                priceRange: Number(priceRange),
                qualityGrade,
                img,
                id_producer: Number(id_producer),
                id_category: Number(id_category),
            };
            const product = await productRepository.create(productData);
            const productDetailsData = productDetail.map(detail => ({
                id_pro: product.id,
                color: detail.color,
                size: detail.size,
                quantity: Number(detail.quantity),
                price: Number(detail.price),
                img: detail.img,
            }));
            await filterRepository.create(productDetailsData);

            const tokensArray = await fireBaseTokenRepository.getAllToken();

            const tokens = tokensArray.map(item => item.token);
            // sendNotifyToUsers("Sản phẩm mới", `Cửa hàng Summer Shop vừa thêm mới 1 sản phẩm : ${name}`, tokens)

            return res.status(200).json({ success: true, message: "Thêm mới sản phẩm thành công", product });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }

    static async update(req, res) {
        try {
            const {
                id,
                name,
                description,
                information,
                priceRange,
                qualityGrade,
                img,
                id_producer,
                id_category,
                status,
                productDetail
            } = req.body

            const updates = [];
            const creates = [];
            const existingProductDetails = await filterRepository.findByIdProd(id);

            // const existingIds = existingProductDetails.map((pd) => pd.id);
            const idsInRequest = productDetail.map((pd) => pd.id).filter((id) => id !== undefined && id !== "");

            await productRepository.update(id, {
                name,
                description,
                information,
                priceRange: Number(priceRange),
                qualityGrade,
                img,
                id_producer,
                id_category,
                updateAt: new Date(),
                status,
            })
            // Phân loại bản ghi cần cập nhật và thêm mới
            productDetail.forEach((detail) => {
                if (detail.id) {
                    updates.push(detail);
                } else {
                    creates.push(detail);
                }
            });

            // Lọc các bản ghi cần xóa
            const deletions = existingProductDetails.filter((pd) => !idsInRequest.includes(pd.id));

            // Thực hiện cập nhật
            for (const detail of updates) {
                const dataUpdate = {
                    color: detail.color,
                    size: detail.size,
                    quantity: Number(detail.quantity),
                    price: Number(detail.price),
                    img: detail.img,
                }
                await filterRepository.update(Number(detail.id), dataUpdate);
            }

            for (const detail of creates) {
                const dataCreate = {
                    id_pro: id,
                    color: detail.color,
                    size: detail.size,
                    quantity: Number(detail.quantity),
                    price: Number(detail.price),
                    img: detail.img,
                }
                await filterRepository.create(dataCreate);
            }
            // Thực hiện xóa
            for (const detail of deletions) {
                await filterRepository.softDelete(detail.id)
            }

            return res.status(200).json({ success: true, message: "Cập nhật sản phẩm thành công" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }


    static async getAll(req, res) {
        try {
            const products = await productRepository.getAll();
            return res.status(200).json({ success: true, products });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }


    static async findById(req, res) {
        try {
            const id = Number(req.params.id);
            const product = await productRepository.getById(id);
            return res.status(200).json({ success: true, data: product });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }

    // static async search(req, res) {
    //     const { sample, orders } = req.body;
    //     try {
    //         const products = await productRepository.search(sample, orders);
    //         return res.status(200).json({ success: true, data: products });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async getPageCount(req, res) {
    //     try {
    //         const pageCount = await productRepository.getPageCount(0);
    //         return res.status(200).json({ success: true, numPages: Math.ceil(pageCount / 12) });
    //     } catch (error) {
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async getById(req, res) {
    //     const { id } = req.params;
    //     try {
    //         const product = await productRepository.getById(id);
    //         return res.status(200).json({ success: true, product });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }




    // static async update(req, res) {
    //     const { id } = req.params;
    //     const { name, description, information, status, img, id_owner, id_category } = req.body;
    //     try {
    //         await productRepository.update(id, { name, description, information, status, img, id_owner, id_category });
    //         return res.status(200).json({ success: true, message: "Cập nhật sản phẩm thành công" });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async softDelete(req, res) {
    //     const { id } = req.params;
    //     try {
    //         await productRepository.softDelete(id);
    //         return res.status(200).json({ success: true, message: "Xoá sản phẩm thành công" });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async restore(req, res) {
    //     const { id } = req.params;
    //     try {
    //         await productRepository.restore(id);
    //         return res.status(200).json({ success: true, message: "Khôi phục sản phẩm thành công" });
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }
}

module.exports = ProductService;
