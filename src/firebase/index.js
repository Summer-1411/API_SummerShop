const admin = require('firebase-admin');
const serviceAccount = require('../../summer-309f4-08c43657ba69.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;