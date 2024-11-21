const admin = require('./index');  // Import admin đã khởi tạo
// Hàm gửi thông báo
function sendNotifyToUsers(productName, tokens) {
    const message = {
        notification: {
            title: "Sản phẩm mới!",
            body: `Chúng tôi vừa thêm sản phẩm mới: ${productName}`,
        },
        tokens: tokens,
    };

    admin.messaging().sendEachForMulticast(message)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}

module.exports = { sendNotifyToUsers };