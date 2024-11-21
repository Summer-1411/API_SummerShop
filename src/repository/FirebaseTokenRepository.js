const prisma = require('../prisma');

class FireBaseTokenRepository {
    static async create(data) {
        return await prisma.firebase_token.create({ data });
    };

    static async findByType(type) {
        return await prisma.firebase_token.findMany({
            where: {
                type: type,
            },
        });
    }
}
module.exports = FireBaseTokenRepository;
