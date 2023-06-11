// require fs and read sign up page
const fs = require("fs");
const errHandler = require("./controllers/errController");
const signUpPage = fs.readFileSync("./views/sign-up.html", "utf-8");
const logInPage = fs.readFileSync("./views/login.html", "utf-8");
const toDoPage = fs.readFileSync("./views/to-do.html", "utf-8");
const profilePage = fs.readFileSync("./views/profile.html", "utf-8");

// require express and fire it
const express = require("express");
const app = express();

// require dotenv and read env variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// mongoose and connect to db
const mongoose = require("mongoose");
mongoose.connect(process.env.DB).then(console.log("DB connected successfully"));

// implement rate limit | first time to try this library :D
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 requests per minute
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// require Routers and middleware functions
const authRouter = require("./routers/authRouter");
const taskRouter = require("./routers/taskRouter");
const { checkAuth } = require("./controllers/authController");
const userRouter = require("./routers/userRouter");

// static files [css, js] middleware
app.use("/script", express.static("./views/script"));
app.use("/style", express.static("./views/style"));

// parsing json from request body middleware

app.use(express.json());

// api routing
app.use("/api/v1/usersAuth", authRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.redirect("/to-do");
});

// html pages routing
app.get("/sign-up", checkAuth, (req, res) => {
  if (res.locals.status == 401) {
    res.status(200).send(signUpPage);
  } else {
    res.send("<h1>You already logged in");
  }
});
app.get("/login", checkAuth, (req, res) => {
  if (res.locals.status == 401) {
    res.status(200).send(logInPage);
  } else {
    res.send("<h1>You already logged in");
  }
});

app.get("/to-do", checkAuth, (req, res) => {
  if (res.locals.status == 401) {
    res.redirect("/login");
  } else if (res.locals.status == 403) {
    res.send("<h1>You are not authorized to see this page");
  } else {
    res.status(200).send(toDoPage);
  }
});

app.get("/profile", checkAuth, (req, res) => {
  if (res.locals.status == 401) {
    res.send("<h1>You must login to see this page");
  } else if (res.locals.status == 403) {
    res.send("<h1>You are not authorized to see this page");
  } else {
    res.status(200).send(profilePage);
  }
});

// logout function
app.get("/logout", checkAuth, (req, res, next) => {
  if (res.locals.status != 200) {
    res.send("<h1>You must login to be enable to logout ?!!");
  } else {
    res.clearCookie("jwt");
  }
  next();
});

// Error middleware
app.use(errHandler);

// lanuch server and listen to port 3000
app.listen(process.env.PORT);
