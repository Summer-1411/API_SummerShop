
const validExpiresTime = (value, time = 15) => {
    console.log('time', time);
    if (!value) {
        return false
    }
    const specificTime = new Date(value);
    console.log('specificTime', specificTime);
    // Thời gian hiện tại
    const currentTime = new Date();
    console.log('currentTime', currentTime);
    // Tính toán khoảng thời gian giữa thời gian hiện tại và thời điểm cụ thể (tính bằng phút)
    const timeDiffInMinutes = (currentTime - specificTime) / (1000 * 60);
    // Kiểm tra xem thời gian đã vượt qua 15 phút chưa
    if (timeDiffInMinutes > time) {
        return false
    }
    return true
}

function hasValue(variable) {
    return variable !== undefined && variable !== null && variable !== '';
}

const numberWithCommas = (number) => {
    return number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Lấy ngày, tháng, năm
    const day = String(date.getDate()).padStart(2, '0'); // Thêm số 0 nếu cần
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();

    // Lấy giờ, phút
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Ghép thành chuỗi định dạng dd/mm/yyyy HH:mm
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

module.exports = {
    validExpiresTime,
    hasValue,
    numberWithCommas,
    formatDate,
}