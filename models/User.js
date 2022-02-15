const mongoose = require("mongoose");

const subTransactionHistorySchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  transactionDate: {
    type: Date,
    required: true,
  },
  currencyName: {
    type: String,
    required: true,
  },
  unitsTraded: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  isBuy: {
    type: Boolean,
    required: true,
  },
});

const subAssetSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  cash: {
    type: Number,
    required: true,
    default: 10000000,
  },
  coins: [
    {
      currencyName: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      averagePrice: {
        type: Number,
      },
    },
  ],
});

const UserSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  transactionHistory: [subTransactionHistorySchema],
  asset: subAssetSchema,
  round: [
    {
      initialMoney: {
        type: Number,
      },
      finalMoney: {
        type: Number,
      },
      transactionResult: [],
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
