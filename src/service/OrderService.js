
const orderRepository = require('../repository/OrderRepository');

const vi = require("../messages/message_vi");
class OrderService {
    static async search(req, res) {


        try {

            let { sample = {} } = req.body;
            let { fromDate, toDate } = sample;
            // Chuyển đổi từ chuỗi dd/mm/yyyy sang đối tượng Date nếu có
            fromDate = fromDate ? new Date(fromDate.split('/').reverse().join('-')) : undefined;
            toDate = toDate ? new Date(toDate.split('/').reverse().join('-')) : undefined;

            // Nếu có toDate thì đặt giờ của toDate thành 23:59:59
            if (toDate) {
                toDate.setHours(23, 59, 59, 999);
            }
            const dataSearch = {
                ...req.body,
                sample: {
                    ...req.body.sample,
                    fromDate,
                    toDate
                }
            }
            const data = await orderRepository.search(dataSearch);
            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }
}
module.exports = OrderService