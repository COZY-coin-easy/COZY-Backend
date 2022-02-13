const express = require("express");
const router = express.Router();

const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, async function (req, res, next) {
  const { email } = req.user;

  try {
    const user = await User.findOne({ email }).lean().exec();

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  const { email, displayName } = req.body;

  try {
    const user = await User.findOne({ email }).lean().exec();

    if (user) {
      return res.status(201).send({ result: "이미 등록된 유저입니다." });
    }

    await User.create({
      email,
      displayName,
      asset: {
        coins: [],
      },
      round: [
        {
          initialMoney: 10000000,
          finalMoney: 0,
        },
      ],
    });

    res.status(201).send({ result: "유저 등록 성공" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
