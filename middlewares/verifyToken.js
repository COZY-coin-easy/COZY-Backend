const createError = require("http-errors");
const admin = require("../config/firebase");
const messages = require("../utils/messages");

async function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decode = await admin.auth().verifyIdToken(token);

    if (decode) {
      req.user = decode;

      next();
    } else {
      next(createError(500, { message: messages.INVALID_TOKEN }));
    }
  } catch (err) {
    next(createError(500, err, { message: messages.UNAUTHORIZED_USER }));
  }
}

module.exports = verifyToken;
