//Create a person having this prototype:
const mongoose = require("mongoose");
let validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: (value) => {
      return validator.isAlpha(value);
    },
  },
  age: Number,
  favoriteFoods: [String],
});

module.exports= mongoose.model("User", userSchema);