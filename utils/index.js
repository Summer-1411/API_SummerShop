 const validExpiresTime = (value) => {
    if(!value){
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
    if (timeDiffInMinutes > 15) {
        return false
    } 
    return true
}
module.exports = {
    validExpiresTime
}