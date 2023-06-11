const mongoose = require("mongoose");
const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter task name"],
  },
  user_id: {
    type: String,
    required: [true, "Authorization error, must have an id"],
  },
  isDone: {
    type: Boolean,
    default: false,
  },
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
