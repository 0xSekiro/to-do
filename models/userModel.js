const validator = require("validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const AppError = require("../utilties/appError");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "User must have username"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please enter valid email"],
    required: [true, "User must have email"],
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "User must have password"],
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords are not the same",
    },
    required: [true, "Please confirm your password"],
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password.length < 8) {
    return next(new AppError(400, "Min length for password is 8 length"));
  }
  this._update.password = await bcrypt.hash(this._update.password, 12);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
