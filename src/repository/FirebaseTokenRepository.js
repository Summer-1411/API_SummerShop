const prisma = require('../prisma');

class FireBaseTokenRepository {
    static async create(data) {
        return await prisma.firebase_token.create({ data });
    };
    static async update(token, userId) {
        return await prisma.firebase_token.updateMany({
            where: {
                token: token,  // Tìm kiếm theo token
            },
            data: {
                userId: userId,  // Cập nhật userId
            },
        });
    }

    static async findByToken(token) {
        return await prisma.firebase_token.findMany({
            where: {
                token: token,
            },
        });
    }

    static async deleteByUserId(userId) {
        return await prisma.firebase_token.deleteMany({
            where: {
                userId: userId,
            },
        });
    }
    static async deleteByIds(ids) {
        return await prisma.firebase_token.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }

    static async getAllToken() {
        return await prisma.firebase_token.findMany({
            select: {
                token: true, // Chỉ lấy trường `token`
            },
        });
    }
}
module.exports = FireBaseTokenRepository;
