const express = require("express");
const router = express.Router();

router.get("/", async function (req, res, next) {
  res.status(200).send("Ok");
});

module.exports = router;
