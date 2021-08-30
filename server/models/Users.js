const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const USER = new Schema({
  userName: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Users = mongoose.models.User || mongoose.model("HabitTrackerUser", USER);

module.exports = Users;
