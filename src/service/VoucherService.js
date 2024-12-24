// src/service/VoucherService.js
const voucherRepository = require('../repository/VoucherRepository');
const vi = require('../messages/message_vi');
const { hasValue } = require("../../utils");
const { getTokens } = require('../../utils/firebase');
const { sendNotifyToUsers } = require('../firebase/notify');
class VoucherService {
    // Tìm kiếm voucher chưa hết hạn
    static async searchNotExpired(req, res) {
        try {
            // Lấy danh sách voucher chưa hết hạn
            const data = await voucherRepository.searchNotExpired();

            const vouchers = data.map(voucher => {
                const isInvalidQuantity = voucher.quantity === 0;
                return {
                    ...voucher,
                    isExpired: isInvalidQuantity // Nếu hết hạn hoặc quantity = 0 thì valid = false
                };
            });
            return res.status(200).json({ success: true, data: vouchers });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }
    static async delete(req, res) {
        try {
            // Lấy danh sách voucher chưa hết hạn
            const { id } = req.body
            // console.log('id', id);

            const data = await voucherRepository.softDelete(id);
            return res.status(200).json({ success: true, message: "Xóa mã giảm giá thành công" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }

    // Filter by admin
    static async filter(req, res) {
        try {
            const data = await voucherRepository.filter(req.body);
            // Lấy thời gian hiện tại
            const currentTime = new Date();
            // Chuyển chuỗi ngày thành đối tượng Date


            // Tạo đối tượng Date mới chỉ bao gồm năm, tháng, ngày (không có giờ, phút, giây)
            const currentDate = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate());
            const vouchers = data.map(voucher => {
                const expiredTime = new Date(voucher.expiredTime);
                const expiredDate = new Date(expiredTime.getFullYear(), expiredTime.getMonth(), expiredTime.getDate());
                const isExpired = expiredDate.getTime() < currentDate.getTime();
                return {
                    ...voucher,
                    isExpired: isExpired // Nếu hết hạn hoặc quantity = 0 thì valid = false
                };
            });
            return res.status(200).json({ success: true, data: vouchers });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }

    // create by admin
    static async create(req, res) {
        try {
            const {
                code,
                value,
                quantity,
                minOrderValue,
                maxMoney,
                expiredTime,
                description,
            } = req.body;
            const existingVoucher = await voucherRepository.findUniqueCode(code);
            if (existingVoucher) {
                return res.status(400).json({ success: false, message: "Mã giảm giá đã tồn tại !" });
            }
            const expiredDate = expiredTime ? new Date(expiredTime.split('/').reverse().join('-')) : undefined;
            const data = {
                code,
                value: Number(value),
                quantity: Number(quantity),
                initQuantity: Number(quantity),
                minOrderValue: hasValue(minOrderValue) ? Number(minOrderValue) : undefined,
                maxMoney: hasValue(maxMoney) ? Number(maxMoney) : undefined,
                expiredTime: expiredDate,
                description: description ? description : undefined,
            }
            const dataResponse = await voucherRepository.create(data);
            const tokens = await getTokens()
            sendNotifyToUsers("Mã giảm giá", `Cửa hàng Summer Shop vừa thêm mới mã giảm giá : ${code}`, tokens)
            return res.status(200).json({ success: true, data: dataResponse });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }

    // update by admin
    static async update(req, res) {
        try {
            const {
                id,
                code,
                value,
                quantity,
                maxMoney,
                minOrderValue,
                expiredTime,
                description,
                status,
            } = req.body;
            const existingVoucher = await voucherRepository.findUniqueCode(code);
            const checkUpdate = VoucherService.checkExistUpdate(existingVoucher, id)
            if (!checkUpdate) {
                return res.status(400).json({ success: false, message: "Mã giảm giá đã tồn tại !" });
            } else {
                const expiredDate = expiredTime ? new Date(expiredTime.split('/').reverse().join('-')) : undefined;
                const data = {
                    code,
                    value: Number(value),
                    quantity: Number(quantity),
                    minOrderValue: hasValue(minOrderValue) ? Number(minOrderValue) : undefined,
                    maxMoney: hasValue(maxMoney) ? Number(maxMoney) : undefined,
                    expiredTime: expiredDate,
                    description: description ? description : undefined,
                    status
                }
                const dataResponse = await voucherRepository.update(id, data);
                return res.status(200).json({ success: true, data: dataResponse });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: vi.serverError });
        }
    }

    static checkExistUpdate = (dataExist, id) => {
        if (dataExist) {
            if (dataExist.id === id) {
                return true
            } else {
                return false
            }
        }
        return true
    }


}

module.exports = VoucherService;
