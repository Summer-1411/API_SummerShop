const prisma = require('../prisma');

class FilterRepository {
    static async create(data) {
        return await prisma.filter.createMany({
            data: data,
        });
    };

    static async findByIdProd(id) {
        return await prisma.filter.findMany({
            where: { id_pro: parseInt(id), status: 1 },
        });
    }

    static async update(id, detail) {
        return await prisma.filter.update({
            where: { id: parseInt(id) },
            data: {
                color: detail.color,
                size: detail.size,
                quantity: detail.quantity,
                price: detail.price,
                img: detail.img,
            },
        });
    }

    static async softDelete(id) {
        return await prisma.filter.update({
            where: { id: parseInt(id) },
            data: { status: 0 },
        });
    }

    static async getColorAndImg(id) {
        return await prisma.filter.groupBy({
            by: ['color', 'img'],
            where: {
                id_pro: parseInt(id),
                status: 1
            },
        });
    }
    static async getSize(id) {
        return await prisma.filter.groupBy({
            by: ['size'],
            where: {
                id_pro: parseInt(id),
                status: 1
            },
        });
    }

    static async findByIdProdAndColorAndSize(id, color, size) {
        return await prisma.filter.findFirst({
            where: {
                id_pro: parseInt(id),
                color: color,
                size: size,
                status: 1,
            },
        });
    }
}

module.exports = FilterRepository;
