const express = require("express");
const router = express.Router();
const User = require("../models/User");

const verifyToken = require("../middlewares/verifyToken");

router.get("/transactionHistory/:userId", verifyToken, async function (req, res, next) {
  const { email } = req.user;

  try {
    const { transactionHistory } = await User.findOne({ email }).lean.exec();

    res.status(200).json({ transactionHistory });

  } catch(err) {
    next(err);
  }
});

router.post("/candlestick", async function (req, res, next) {
  const { candlestick, email } = req.body.headers;

  try {
    await User.findOneAndUpdate({ email }, { candlestick });

    res.status(201).send({ result: "candlestick save success" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
