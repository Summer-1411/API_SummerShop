const { hasValue } = require("../../utils");
const prisma = require("../prisma");

class UserRepository {
    static async filter(data) {
        const { sample = {}, orders = {} } = data
        const { email, username, gender, status } = sample;
        const { property, direction } = orders;
        return await prisma.user.findMany({
            where: {
                // Điều kiện tìm kiếm gần đúng cho email
                email: email ? { contains: email } : undefined,
                // Điều kiện tìm kiếm gần đúng cho username
                username: username ? { contains: username } : undefined,
                // Điều kiện tìm kiếm chính xác cho gender
                gender: gender ? parseInt(gender) : undefined,
                // Điều kiện tìm kiếm chính xác cho status
                status: hasValue(status) ? parseInt(status) : undefined,
            },
            orderBy: {
                [property || 'createAt']: direction === 'desc' ? 'desc' : 'asc', // Mặc định sắp xếp theo 'createAt' và theo 'asc'
            },
        })
    }


}

module.exports = UserRepository;
