
const apiLogRepository = require('../repository/ApiLogRepository');
const vi = require("../messages/message_vi");
const { sendNotifyToUsers } = require('../firebase/notify');
const { getTokens } = require('../../utils/firebase');
class apiLogService {
    static async search(req, res) {
        // const tokens = await getTokens()

        // sendNotifyToUsers("Test api", "Check message", tokens)
        try {
            const data = await apiLogRepository.search(req.body);

            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }
}
module.exports = apiLogService