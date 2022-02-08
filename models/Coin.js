const mongoose = require("mongoose");

const CoinSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  ticker: [],
});

const CoinSchema = mongoose.model("Coin", CoinSchema);

module.exports = Coin;
