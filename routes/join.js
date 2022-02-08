const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.get("/", async function (req, res, next) {
  const { email } = req.data;

  try {
    const user = await User.findOne({ email }).lean().exec();
    res.status(201).send(user._id);
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  const { email, username } = req.body;

  try {
    const user = await User.findOne({ email }).lean().exec();

    if (user) {
      return res.status(201).send({ result: "이미 등록된 유저입니다." });
    }

    await User.create({
      email,
      username,
    });

    res.status(201).send({ result: "유저 등록 성공" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
