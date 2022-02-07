const admin = require("../config/firebase");

async function verifyToken(req, res, next) {
  const token = req.headers.autorization;

  try {
    const decode = await admin.auth().verifyIdToken(token);

    if (decode) {
      req.user = decode;

      next();
    } else {
      return res.send({ message: "유효하지 않은 토큰입니다." });
    }
  } catch (err) {
    next(err);
  }
}

module.exports = verifyToken;
