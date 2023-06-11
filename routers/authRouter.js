const authController = require("../controllers/authController");
const express = require("express");
const authRouter = express.Router();

// create user route
authRouter.route("/sign-up").post(authController.signUp);
authRouter.route("/sign-in").post(authController.logIn);

module.exports = authRouter;
