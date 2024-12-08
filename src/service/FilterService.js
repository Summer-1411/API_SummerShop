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
}

module.exports = FilterService;
