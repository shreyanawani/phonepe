const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  investor: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  equity: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});
// autoIncrement.initialize(mongoose.connection);
// UserSchema.plugin(autoIncrement.plugin, "User");
const Offer = mongoose.model("Offer", OfferSchema);

module.exports = Offer;
