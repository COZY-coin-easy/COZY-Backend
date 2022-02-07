const express = require("express");
const router = express.Router();
const User = require("../models/User");

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
