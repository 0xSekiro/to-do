const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const AppError = require("../utilties/appError");

const User = require("../models/userModel");

exports.signUp = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = { ...req.body };
    const user = await User.create({
      username,
      email,
      password,
      passwordConfirm,
    });
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("jwt", token);
    res.status(201).json({
      status: "success",
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { username, password } = { ...req.body };

    // check if username and password parameters are exist
    if (!username || !password) {
      return next(new AppError(400, "Please enter username and password"));
    }
    const user = await User.findOne({ username });

    // check if user are exist in db and if password are correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError(404, "Invalid username or password"));
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("jwt", token, { maxAge: Math.pow(2, 31) });
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    try {
      const id = (await jwt.verify(token, process.env.JWT_SECRET)).id;
      res.locals.id = id;
      res.locals.status = 200;
    } catch (err) {
      res.locals.status = 403;
    }
  } catch (err) {
    res.locals.status = 401;
  } finally {
    next();
  }
};
