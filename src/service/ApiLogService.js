
const apiLogRepository = require('../repository/ApiLogRepository');
const fireBaseTokenRepository = require('../repository/FirebaseTokenRepository');

const vi = require("../messages/message_vi");
const { sendNotifyToUsers } = require('../firebase/notify');
class apiLogService {
    static async search(req, res) {
        const tokensArray = await fireBaseTokenRepository.getAllToken();

        const tokens = tokensArray.map(item => item.token);

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