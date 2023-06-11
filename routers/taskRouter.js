const express = require("express");
const authController = require("../controllers/authController");
const taskController = require("../controllers/taskController");

const taskRouter = express.Router();

taskRouter.use(authController.checkAuth);

taskRouter
  .route("/")
  .get(taskController.getTasks)
  .post(taskController.addTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = taskRouter;
