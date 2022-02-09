const mongoose = require("mongoose");

const subTransactionHistorySchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  transactionDate: Date,
  currencyName: String,
  unitsTrade: Number,
  price: Number,
  total: Number,
});

const subAssetSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  cash: {
    type: Number,
    required: true,
    default: 10000000,
  },
  coin: [
    {
      currencyName: {
        type: String,
        required: true,
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
  userId: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  transactionHistory: [subTransactionHistorySchema],
  asset: subAssetSchema,
  round: [
    {
      initialMoney: Number,
      fianlMoney: Number,
      transactionResult: [],
    },
  ],
  candlestick: [],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
