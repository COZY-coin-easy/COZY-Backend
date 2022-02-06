const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

// serviceAccount는 공개로 보여지면 좋지 않다. 보호가 필요하다.
