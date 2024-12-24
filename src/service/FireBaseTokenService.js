
const fireBaseTokenRepository = require('../repository/FirebaseTokenRepository');
const vi = require("../messages/message_vi");

class fireBaseTokenService {
    static async create(req, res) {
        try {
            const userId = req?.user?.id ?? null;
            const {
                token,
            } = req.body
            const dataSave = {
                token,
                userId,
                createdAt: new Date(),
            }
            if (userId) {
                await fireBaseTokenRepository.deleteByUserId(userId)
            }
            const tokenRecords = await fireBaseTokenRepository.findByToken(token);



            if (tokenRecords.length > 0) {
                const [recordToKeep, ...recordsToDelete] = tokenRecords;

                if (recordsToDelete.length > 0) {
                    const idsToDelete = recordsToDelete.map(record => record.id); // Lấy danh sách ID để xóa
                    await fireBaseTokenRepository.deleteByIds(idsToDelete); // Xóa các bản ghi thừa
                }
                await fireBaseTokenRepository.update(recordToKeep.token, userId);
            } else {
                await fireBaseTokenRepository.create(dataSave);
            }

            return res.status(200).json({ success: true, mesage: "Thành công" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }
}
module.exports = fireBaseTokenService