// src/repository/VoucherRepository.js
const prisma = require("../prisma");

class VoucherRepository {
    // Tìm kiếm voucher chưa hết hạn
    static async searchNotExpired() {
        const currentTime = new Date(); // Lấy thời gian hiện tại
        currentTime.setHours(0, 0, 0, 0);
        return await prisma.voucher.findMany({
            where: {
                expiredTime: {
                    gte: currentTime // Lọc các voucher có expiredTime lớn hơn hoặc bằng thời gian hiện tại
                },
            },
        });
    }

    // Hàm filter/search voucher
    static async filter(data) {
        const { sample = {}, orders = {} } = data
        const { code, value, quantity, minOrderValue, maxMoney, expiredTime, description } = sample;
        const { property, direction } = orders;
        return await prisma.voucher.findMany({
            where: {
                // Điều kiện tìm kiếm gần đúng cho code voucher
                code: code ? { contains: code } : undefined,
                // Điều kiện tìm kiếm cho giá trị voucher
                value: value ? { gte: Number(value) } : undefined, // Tìm những voucher có giá trị lớn hơn hoặc bằng giá trị input
                // Điều kiện tìm kiếm cho số lượng voucher
                quantity: quantity ? { gte: Number(quantity) } : undefined,
                // Điều kiện tìm kiếm cho giá trị đơn hàng tối thiểu
                minOrderValue: minOrderValue ? { gte: Number(minOrderValue) } : undefined,
                // Điều kiện tìm kiếm cho số tiền tối đa voucher
                maxMoney: maxMoney ? { lte: Number(maxMoney) } : undefined,
                // Điều kiện tìm kiếm cho ngày hết hạn voucher (dùng để tìm voucher chưa hết hạn)
                expiredTime: expiredTime ? { gte: new Date(expiredTime) } : undefined,
                // Điều kiện tìm kiếm mô tả voucher
                description: description ? { contains: description } : undefined,
            },
            orderBy: {
                // Sắp xếp theo thuộc tính 'property' (mặc định là 'createAt') và hướng 'asc' hoặc 'desc'
                [property || 'createAt']: direction === 'desc' ? 'desc' : 'asc',
            },
        });
    }

    static async findUniqueCode(code) {
        return await prisma.voucher.findFirst({
            where: {
                code: code,
            },
        });
    }

    static async create({ code, value, quantity, initQuantity, minOrderValue, maxMoney, expiredTime, description, createUser }) {
        return await prisma.voucher.create({
            data: {
                code,
                value,
                quantity,
                initQuantity,
                minOrderValue,
                maxMoney,
                expiredTime,
                description,
                createAt: new Date()
            }
        });
    }

    // Cập nhật voucher
    static async update(id, { code, value, quantity, minOrderValue, maxMoney, expiredTime, description }) {
        return await prisma.voucher.update({
            where: { id },
            data: {
                code,
                value,
                quantity,
                minOrderValue,
                maxMoney,
                expiredTime,
                description,
                updateAt: new Date()
            }
        });
    }
}

module.exports = VoucherRepository;
