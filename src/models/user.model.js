const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return validator.isEmail(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return validator.isStrongPassword(v);
        },
        message: () =>
          `Password is not strong enough! It should be at least 8 characters long and include uppercase, lowercase, number, and symbol.`,
      },
    },
    profileURL: {
      type: String,
      validate: {
        validator: function (v) {
          // Allow empty or valid URL
          return !v || validator.isURL(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    about: {
      type: String,
    },
    age: {
      type: Number,
      min: 13,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
