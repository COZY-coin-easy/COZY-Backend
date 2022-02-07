const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/candlestick", async function (req, res, next) {
  const candlestick = req.body.headers.candlestick;
  const email = req.body.headers.email;

  try {
    await User.findOneAndUpdate({ email }, { candlestick });

    res.status(201).send({ result: "candlestick save success" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
