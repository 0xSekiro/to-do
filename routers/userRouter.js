const express = require("express");
const userController = require("../controllers/userController");
const { checkAuth } = require("../controllers/authController");

const userRouter = express.Router();
userRouter.use(checkAuth);

userRouter
  .route("/")
  .get(userController.getUser)
  .patch(userController.changePassword);

module.exports = userRouter;
