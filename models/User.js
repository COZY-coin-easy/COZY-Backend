const mongoose = require("mongoose");

const subTransactionHistorySchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  transactionDate: Date,
  CurrencyName: String,
  unitsTrade: Number,
  price: Number,
  total: Number,
});

const subAssetSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  cash: {
    type: Number,
    require: true,
    default: 10000000,
  },
  coin: [{
    type: String,
    quantity: Number,
    averagePrice: Number,
  }],
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
  round: [{
    initialMoney: Number,
    fianlMoney: Number,
    transactionResult: [],
  }],
  candlestick: [],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
