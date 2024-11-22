
const fireBaseTokenRepository = require('../repository/FirebaseTokenRepository');
const vi = require("../messages/message_vi");

class fireBaseTokenService {
    static async create(req, res) {
        try {
            const userId = req?.user?.id ?? null;
            const {
                type,
                token,
            } = req.body
            const dataSave = {
                token,
                type,
                userId,
                createdAt: new Date(),
            }
            console.log('___________________________________________START_________________________________________________');

            if (userId) {
                await fireBaseTokenRepository.deleteByUserId(userId)
            }
            const tokenRecords = await fireBaseTokenRepository.findByToken(token);
            console.log('tokenRecords', tokenRecords);


            if (tokenRecords.length > 0) {
                const [recordToKeep, ...recordsToDelete] = tokenRecords;

                if (recordsToDelete.length > 0) {
                    const idsToDelete = recordsToDelete.map(record => record.id); // Lấy danh sách ID để xóa
                    await fireBaseTokenRepository.deleteByIds(idsToDelete); // Xóa các bản ghi thừa
                }
                await fireBaseTokenRepository.update(recordToKeep.token, userId);
            } else {
                // console.log('dataSave', dataSave);

                await fireBaseTokenRepository.create(dataSave);
            }
            console.log('___________________________________________END_________________________________________________');

            return res.status(200).json({ success: true, mesage: "Thành công" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }
}
module.exports = fireBaseTokenService