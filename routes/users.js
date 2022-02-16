const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const messages = require("../utils/messages");

router.post("/order/:userid", verifyToken, async function (req, res, next) {
  const { userid } = req.params;
  const { currencyName, unitsTraded, price, total, isBuy } = req.body;

  try {
    const { transactionHistory, asset } = await User.findById(userid)
      .lean()
      .exec();

    const newTransactionHistory = {
      currencyName,
      unitsTraded,
      price,
      total,
      isBuy,
    };

    transactionHistory.push(newTransactionHistory);

    const userCash = asset.cash;
    const updatedUserCash = userCash + (isBuy ? -total : total);
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
      const updatedQuantity =
        userCoins[coinIndex].quantity + (isBuy ? unitsTraded : -unitsTraded);
      let updatedAveragePrice = 0;

      if (isBuy) {
        updatedAveragePrice =
          (userCoins[coinIndex].quantity * userCoins[coinIndex].averagePrice +
            total) /
          updatedQuantity;
      } else {
        updatedAveragePrice = updatedQuantity
          ? userCoins[coinIndex].averagePrice
          : 0;
      }

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

    res.status(201).send({ result: messages.ORDER_UPDATE_SUCCESS });
  } catch (err) {
    next(
      createError(500, err, {
        message: messages.ORDER_UPDATE_FAIL,
      })
    );
  }
});

module.exports = router;
