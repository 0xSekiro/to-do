const Task = require("../models/taskModel");
const AppError = require("../utilties/appError");

exports.addTask = async (req, res) => {
  try {
    const task = await Task.create({
      name: req.body.name,
      user_id: res.locals.id,
    });
    res.status(201).json({
      status: "success",
      task,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user_id: res.locals.id });
    res.status(200).json({
      status: "success",
      tasks,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};

exports.updateTask = async (req, res, next) => {
  const task = await Task.findOneAndUpdate(
    { name: req.body.name, user_id: res.locals.id },
    {
      isDone: req.body.isDone,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "success",
    task,
  });
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.deleteOne({
      name: req.body.name,
      user_id: res.locals.id,
    });
    if (task.deletedCount == 0) {
      return next(new AppError(400, "No task to delete"));
    }
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
