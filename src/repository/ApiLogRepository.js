const prisma = require('../prisma');

class ApiLogRepository {
    static async create(logData) {
        return await prisma.api_log.create({
            data: {
                method: logData.method,
                url: logData.url,
                requestBody: logData.requestBody,
                statusCode: logData.statusCode,
                responseBody: logData.responseBody,
                responseTime: logData.responseTime,
                createAt: logData.createAt || new Date(),
                userAgent: logData.userAgent,
                userId: logData.userId,
                ipAddress: logData.ipAddress
            },
        });
    }

    static async search(data) {
        const { sample = {}, orders = {}, pagination = { page: 1, pageSize: 8 } } = data;
        const { method, url, requestBody, ipAddress } = sample;
        const { page, pageSize } = pagination; // Lấy số trang và số lượng bản ghi mỗi trang
        // Tính toán số bản ghi cần bỏ qua và số bản ghi cần lấy
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const dataList = await prisma.api_log.findMany({
            where: {
                method: method ? method : undefined,
                url: url ? { contains: url } : undefined,
                requestBody: requestBody ? { contains: requestBody } : undefined,
                ipAddress: ipAddress ? { contains: ipAddress } : undefined,
            },
            orderBy: {
                ['createAt']: 'desc', // Mặc định sắp xếp theo 'createAt' và theo 'asc'
            },
            skip: skip,
            take: take,
        })
        // Lấy tổng số bản ghi từ API log
        const totalCount = await prisma.api_log.count({
            where: {
                method: method ? method : undefined,
                url: url ? { contains: url } : undefined,
                requestBody: requestBody ? { contains: requestBody } : undefined,
                ipAddress: ipAddress ? ipAddress : undefined,
            },
        });
        return {
            data: dataList,
            pagination: {
                total: totalCount,
                pageSize: pageSize,
                current: page,
                totalPages: Math.ceil(totalCount / pageSize),
            },
        };
    }

    static async deleteProcess() {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // Lấy thời gian của 2 ngày trước
        const result = await prisma.api_log.deleteMany({
            where: {
                createAt: {
                    lt: twoDaysAgo, // Điều kiện nhỏ hơn 2 ngày trước
                },
            },
        });
    }
}

module.exports = ApiLogRepository;
