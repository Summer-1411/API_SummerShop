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




}

module.exports = ProductRepository;
