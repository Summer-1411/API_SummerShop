const fireBaseTokenRepository = require('../src/repository/FirebaseTokenRepository');
const getTokens = async () => {
    const tokensArray = await fireBaseTokenRepository.getAllToken();
    const tokens = tokensArray.map(item => item.token);
    return tokens;
}

module.exports = {
    getTokens
}