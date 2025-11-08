const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: String,
  items: Array,
  total: Number,
});

module.exports = mongoose.model("Order", orderSchema);
