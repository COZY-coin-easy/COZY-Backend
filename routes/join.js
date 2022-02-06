const express = require("express");
const router = express.Router();
const verifyIdToken = require("../middlewares/verifyToken");

const User = require("../models/User");

router.get("/", verifyIdToken, async function (req, res, next) {
  const { email } = req.user;

  try {
    const user = await User.findOne({ email }).lean().exec();

    if (user) {
      return res.status(200).send({ result: "success" });
    } else {
      return res.status(200).send({ result: "Not exist user" });
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  const { email, username } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

    if (user) {
      return res.status(201).send({ message: "존재하는 유저입니다." });
    }

    res.status(201).send({ result: "success" });

    await User.create({
      email,
      username,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
