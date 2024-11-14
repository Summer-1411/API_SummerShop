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
module.exports = {
    validExpiresTime,
    hasValue
}