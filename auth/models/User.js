const mongoose = require("mongoose");

//create schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    imagePath: String,
});
//table name is user
const User = mongoose.model("User", userSchema);
module.exports = User;