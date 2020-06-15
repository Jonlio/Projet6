const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Schema user
const userSchema = mongoose.Schema({
  userID: { type: String, require: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);