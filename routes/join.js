const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const messages = require("../utils/messages");

router.get("/", verifyToken, async function (req, res, next) {
  const { email } = req.user;

  try {
    const user = await User.findOne({ email }).lean().exec();

    res.status(200).send({ user });
  } catch (err) {
    next(
      createError(500, err, {
        message: messages.GET_USER_INFO_FAIL,
      })
    );
  }
});

router.post("/", async function (req, res, next) {
  const { email, displayName } = req.body;

  try {
    const user = await User.findOne({ email }).lean().exec();

    if (user) {
      return res.status(201).send({ result: messages.JOINED_USER });
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

    res.status(201).send({ result: messages.USER_JOIN_SUCCESS });
  } catch (err) {
    next(
      createError(500, err, {
        message: messages.USER_JOIN_FAIL,
      })
    );
  }
});

module.exports = router;
