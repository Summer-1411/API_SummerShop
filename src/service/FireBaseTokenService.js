
const fireBaseTokenRepository = require('../repository/FirebaseTokenRepository');
const vi = require("../messages/message_vi");

class fireBaseTokenService {
    static async create(req, res) {
        try {
            const {
                type,
                token,
            } = req.body
            const dataSave = {
                token,
                type,
                createdAt: new Date(),
            }
            const data = await fireBaseTokenRepository.create(dataSave);
            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }
}
module.exports = fireBaseTokenService