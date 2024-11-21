
const userRepository = require('../repository/UserRepository');
const vi = require("../messages/message_vi");
class UserService {
    static async filter(req, res) {

        try {
            const data = await userRepository.filter(req.body);
            return res.status(200).json({ success: true, data: data });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }
}
module.exports = UserService