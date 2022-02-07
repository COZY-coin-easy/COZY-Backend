const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/", async function (req, res, next) {
  const { email, username } = req.body;

  try {
    const user = await User.findOne({ email }).lean().exec();

    if (user) {
      return res.status(201).send({ result: "로그인 성공" });
    }

    res.status(201).send({ result: "유저 등록 성공" });

    await User.create({
      email,
      username,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
