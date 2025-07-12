//schema for user logins

const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // username and password will be added by passportLocalMongoose
});

userSchema.plugin(passportLocalMongoose); // adds username, hash, salt, etc.

module.exports = mongoose.model("User", userSchema);
