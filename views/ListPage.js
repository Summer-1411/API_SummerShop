const ListPage = (invoices) => {
    return `${invoices.map(item => (
        `
        <div>
            <div style="text-align: center;">
                <h1>Summer Shop</h1>
            </div>
            <div>
                <p class="muted" style="text-align: center;">Ngày đặt:  ${item.orderDate}</p>
            </div>
        </div>
        <div style="margin-bottom: 10px;">
            <table>
                <tr>
                    <td colspan="2">
                        <span>Mã hóa đơn: </span> <strong>${item.id}</strong>
                    </td>
                </tr>
                <tr>
                    <td><span>Khách hàng: </span> <strong>${item.username}</strong></td>
                    <td>
                        <span>Email: </span> <strong>${item.email}</strong>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Số điện thoại: </span> <strong>${item.phone}</strong>
                    </td>
                    <td>
                        <span>Địa chỉ nhận hàng: </span> <strong>${item.address}</strong>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span>Trạng thái thanh toán: </span> <strong>${item.status}</strong>
                    </td>
                    <td>
                        <span>Số tiền cần thanh toán: </span> <strong>${item.total}</strong>
                    </td>
                </tr>
            </table>


        </div>
        <table id="customers">
            <thead>
                <tr>
                    <th>Mã sản phầm</th>
                    <th>Tên sản phầm</th>
                    <th>Phân loại</th>
                    <th class="text-right">Số lượng</th>
                    <th class="text-right">Đơn giá</th>
                    <th class="text-right">Thành tiền</th>
                </tr>
            </thead>
            <tbody>

            ${item?.products?.map(product => (
            `<tr>
                    <td>${product._id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td class="text-right">${product.quantity}</td>
                    <td class="text-right">${product.price}</td>
                    <td class="text-right">${product.total}</td>
            </tr>`
        )).join('')
        }
                <tr>
                    <td colspan="5" class="text-right">
                        <strong>
                            Giảm:
                        </strong>
                    </td>
                    <td class="text-right">
                        <strong>
                            ${item.voucher}
                        </strong>
                    </td>
                </tr>
                <tr>
                    <td colspan="5" class="text-right">
                        <strong>
                            Tổng cộng:
                        </strong>
                    </td>
                    <td class="text-right">
                        <strong>
                            ${item.total}
                        </strong>
                    </td>
                </tr>

            </tbody>
        </table>
        <div class="footer">
            <p>Chúc quý khách có những trải nhiệm tốt cùng <strong>Summer Shop</strong></p>
             Mọi thắc mắc khi mua hàng, thanh toán, yêu cầu khi đổi hàng, hoàn hàng vui lòng liên hệ qua Zalo <a href="https://zalo.me/0373984007">0373984007</a>.
            <p>Xin chân thành cảm ơn !</p>
        </div>
        <div class="muted" style="text-align: left; padding: 8px 0;">Thông tin cửa hàng: 2Q8M+PM3, Đ. Phạm Hùng, Keangnam, Nam Từ Liêm, Hà Nội
        </div>
        <div style="text-align: center; background-color: #f5f5f5; padding: 4px;">
            <p>Summer Shop ©2024 Created by Summer 0373984007</p>
        </div>
        <div style="margin: 20px 0; border: 2px dashed black; width: 100%;"></div>`
    )).join('')}`
}

module.exports = ListPage