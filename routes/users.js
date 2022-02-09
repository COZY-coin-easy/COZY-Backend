const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");

router.get(
  "/transaction-history/:userid",
  verifyToken,
  async function (req, res, next) {
    const { email } = req.user;

    try {
      const { transactionHistory } = await User.findOne({ email }).lean.exec();

      res.status(200).json({ data: transactionHistory });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/candlestick/:userid", async function (req, res, next) {
  const { userid } = req.params;
  const { candlestick } = req.body;

  try {
    await User.findByIdAndUpdate(userid, { candlestick });

    res.status(201).send({ result: "candlestick save success" });
  } catch (err) {
    next(err);
  }
});

router.get("/asset/:userid", verifyToken, async function (req, res, next) {
  const { userid } = req.params;

  try {
    const user = await User.findById({ _id: userid }).lean().exec();

    res.status(200).send({ userAsset: user });
  } catch (err) {
    next(err);
  }
});

router.post("/order/:userid", verifyToken, async function (req, res, next) {
  try {
    const { userid } = req.params;
    const { currencyName, unitsTraded, total } = req.body;
    const { transactionHistory, asset } = await User.findById(userid)
      .lean()
      .exec();

    delete req.body.authorization;
    const newTransactionHistory = req.body;
    transactionHistory.push(newTransactionHistory);

    const userCash = asset.cash;
    const updatedUserCash = userCash + total;

    const userCoins = asset.coins;

    let coinIndex = null;
    for (let i = 0; i < userCoins.length; i++) {
      if (userCoins[i].currencyName === currencyName) {
        coinIndex = i;
        break;
      }
    }

    if (coinIndex === null) {
      const newCoin = {
        currencyName: currencyName,
        quantity: unitsTraded,
        averagePrice: total / unitsTraded,
      };

      userCoins.push(newCoin);

      await User.findByIdAndUpdate(userid, {
        transactionHistory: transactionHistory,
        asset: {
          cash: updatedUserCash,
          coins: userCoins,
        },
      }).exec();
    } else {
      const updatedQuantity = userCoins[coinIndex].quantity + unitsTraded;
      const updatedAveragePrice =
        (userCoins[coinIndex].quantity * userCoins[coinIndex].averagePrice +
          total) /
        updatedQuantity;

      userCoins[coinIndex].quantity = updatedQuantity;
      userCoins[coinIndex].averagePrice = updatedAveragePrice;

      await User.findByIdAndUpdate(userid, {
        transactionHistory: transactionHistory,
        asset: {
          cash: updatedUserCash,
          coins: userCoins,
        },
      }).exec();
    }

    res.status(201).send({ result: "거래내역 및 자산 업데이트 성공" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
