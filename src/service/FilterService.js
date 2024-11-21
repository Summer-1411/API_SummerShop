const filterRepository = require('../repository/FilterRepository');
const vi = require("../messages/message_vi");
class FilterService {
    static async getInforByIdProd(req, res) {
        try {
            const idProd = req.params.id;
            const groupByColors = await filterRepository.getColorAndImg(idProd);
            const groupBySizes = await filterRepository.getSize(idProd);
            const data = {
                listSize: groupBySizes,
                listColorImg: groupByColors
            }
            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }

    static async getDetailByIdProdColorSize(req, res) {
        try {
            const { id, color, size } = req.body;
            const data = await filterRepository.findByIdProdAndColorAndSize(Number(id), color, size);
            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }

    // static async getAllColorsByProductId(req, res) {
    //     try {
    //         const colors = await productDetailRepository.findDistinctColors(req.params.id);
    //         return res.status(200).json({ success: true, colors });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async getAllSizesByProductId(req, res) {
    //     try {
    //         const sizes = await productDetailRepository.findDistinctSizes(req.params.id);
    //         return res.status(200).json({ success: true, sizes });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async getSizesByColorAndProductId(req, res) {
    //     try {
    //         const { color, idpro } = req.query;
    //         const sizes = await productDetailRepository.findSizesByColorAndProductId(color, idpro);
    //         return res.status(200).json({ success: true, sizes });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async getColorsBySizeAndProductId(req, res) {
    //     try {
    //         const { size, idpro } = req.query;
    //         const colors = await productDetailRepository.findColorsBySizeAndProductId(size, idpro);
    //         return res.status(200).json({ success: true, colors });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async getImageByColorAndProductId(req, res) {
    //     try {
    //         const { color, idpro } = req.query;
    //         const image = await productDetailRepository.findImageByColorAndProductId(color, idpro);
    //         return res.status(200).json({ image: image });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async getProductDetails(req, res) {
    //     try {
    //         const { size, color, idpro } = req.query;
    //         const detail = await productDetailRepository.findDetail(size, color, idpro);
    //         return res.status(200).json({ success: true, detail });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async addProductDetail(req, res) {
    //     try {
    //         const productDetail = await productDetailRepository.create(req.body);
    //         return res.status(200).json({ success: true, message: "Added successfully", id: productDetail.id });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async updateProductDetail(req, res) {
    //     try {
    //         await productDetailRepository.update(req.params.id, req.body);
    //         return res.status(200).json({ success: true, message: "Updated successfully" });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }

    // static async deleteProductDetail(req, res) {
    //     try {
    //         await productDetailRepository.softDelete(req.params.id);
    //         return res.status(200).json({ success: true, message: "Deleted successfully" });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ success: false, message: vi.serverError });
    //     }
    // }
}

module.exports = FilterService;
