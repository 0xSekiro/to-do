const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const AppError = require("../utilties/appError");

exports.getUser = async (req, res, next) => {
  if (res.locals.status == 200) {
    const user = await User.findOne({ _id: res.locals.id });
    res.status(200).json({
      status: "success",
      user,
    });
  } else {
    res.status(400).json({
      message: "Invalid token",
    });
  }
};

exports.changePassword = async (req, res, next) => {
  // check if user authroized
  if (res.locals.status == 200) {
    let user = await User.findOne({ _id: res.locals.id });
    // check old password is valid
    if (await bcrypt.compare(req.body.password, user.password)) {
      // update user

      // handling if user new password length < 8
      try {
        user = await User.findByIdAndUpdate(
          res.locals.id,
          {
            password: req.body.newPass,
          },
          {
            new: true,
            runValidators: true,
          }
        ).select("-__v");
      } catch (err) {
        return next(err);
      }

      // send response with success message and data
      res.status(200).json({
        status: "success",
        user,
      });
    } else {
      next(new AppError(403, "Invalid password"));
    }
  } else {
    next(new AppError(401, "Invalid token"));
  }
};
