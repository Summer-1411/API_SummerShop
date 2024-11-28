const { hasValue } = require('../../utils');
const prisma = require('../prisma');

class OrderRepository {
    static async search(data) {
        console.log('data', data);

        const { sample = {}, orders = {}, pagination = { page: 1, pageSize: 8 } } = data;
        const { id, fullname, phone, fromDate, toDate, address, method, status } = sample;
        const { page, pageSize } = pagination; // Lấy số trang và số lượng bản ghi mỗi trang
        // Tính toán số bản ghi cần bỏ qua và số bản ghi cần lấy
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        const dataList = await prisma.orders.findMany({
            where: {
                id: id ? Number(id) : undefined,
                fullname: fullname ? { contains: fullname } : undefined,
                phone: phone ? { contains: phone } : undefined,
                status: hasValue(status) ? Number(status) : undefined,
                shipping_method: method ? method : undefined,
                shipping_address: address ? { contains: address } : undefined,
                ...(fromDate && {
                    orderDate: {
                        gte: fromDate,  // Điều kiện từ từ `fromDate` (>=)
                    },
                }),
                ...(toDate && {
                    orderDate: {
                        lte: toDate,  // Điều kiện đến `toDate` (<=)
                    },
                }),
                NOT: {
                    status: 10,  // Loại trừ các bản ghi có status = 10
                },
            },
            orderBy: {
                ['orderDate']: 'desc', // Mặc định sắp xếp theo 'createAt' và theo 'asc'
            },
            skip: skip,
            take: take,
            include: {
                user: {  // Bao gồm thông tin từ bảng `user`
                    select: {
                        email: true,  // Lấy trường email
                        username: true,  // Lấy trường username
                    },
                },
                order_detail: {  // Bao gồm thông tin `order_detail` theo `id_order`
                    include: {
                        filter: {  // Lấy thông tin `filter` liên quan đến `order_detail`
                            include: {
                                product: {  // Bao gồm thông tin từ bảng `product`
                                    select: {
                                        name: true,  // Lấy trường `name` của sản phẩm
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
        // Lấy tổng số bản ghi từ API log
        const totalCount = await prisma.orders.count({
            where: {
                id: id ? Number(id) : undefined,
                fullname: fullname ? { contains: fullname } : undefined,
                phone: phone ? { contains: phone } : undefined,
                status: hasValue(status) ? Number(status) : undefined,
                shipping_method: method ? method : undefined,
                shipping_address: address ? { contains: address } : undefined,
                ...(fromDate && {
                    orderDate: {
                        gte: fromDate,
                    },
                }),
                ...(toDate && {
                    orderDate: {
                        lte: toDate,
                    },
                }),
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
}


module.exports = OrderRepository;
