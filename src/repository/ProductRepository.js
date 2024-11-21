// src/repositories/ProductRepository.js
const prisma = require("../prisma");

class ProductRepository {
    static async create(data) {
        return await prisma.product.create({ data });
    }

    static async update(id, data) {
        return await prisma.product.update({
            where: { id },
            data,
        });
    }
    static async getAll() {
        return await prisma.product.findMany()
    }

    static async getById(id) {
        return await prisma.product.findUnique({
            where: { id },
        });
    }



    // static async search(sample, orders) {
    //     return await prisma.product.findMany({
    //         where: {
    //             deleted: 0,
    //             ...(sample.name && {
    //                 name: {
    //                     contains: sample.name,
    //                     mode: 'insensitive',
    //                 },
    //             }),
    //             ...(sample.idCategory && { id_category: sample.idCategory }),
    //             ...(sample.idOwner && { id_owner: sample.idOwner }),
    //             ...(sample.id && { id: sample.id }),
    //         },
    //         orderBy: orders ? { [orders.property]: orders.direction } : undefined,
    //     });
    // }







    // static async softDelete(id) {
    //     return await prisma.product.update({
    //         where: { id },
    //         data: { deleted: 1 },
    //     });
    // }

    // static async restore(id) {
    //     return await prisma.product.update({
    //         where: { id },
    //         data: { deleted: 0 },
    //     });
    // }
}

module.exports = ProductRepository;
