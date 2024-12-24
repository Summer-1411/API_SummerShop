const admin = require('./index');  // Import admin đã khởi tạo
// Hàm gửi thông báo
function sendNotifyToUsers(title, description, tokens) {

    let message = {
        notification: {
            title: title,
            body: description,
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