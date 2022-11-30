const mongoose = require("mongoose");
// const autoIncrement = require("mongoose-auto-increment");
const uuid = require("uuid");

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    // default: uuid.v4(),
  },
  entrepreneur: {
    type: String,
    required: true,
  },
  pitchTitle: {
    type: String,
    required: true,
  },
  pitchIdea: {
    type: String,
    required: true,
  },
  askAmount: {
    type: Number,
    required: true,
  },
  equity: {
    type: Number,
    required: true,
  },
});
// autoIncrement.initialize(mongoose.connection);
// UserSchema.plugin(autoIncrement.plugin, "User");
const User = mongoose.model("User", UserSchema);

module.exports = User;
