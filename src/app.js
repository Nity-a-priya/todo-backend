const express = require("express");
const {
  setCookie,
  getTodos,
  addTodo,
  editTodo,
  deleteTodo,
  MarkTodoAsDone
} = require("./logic");

const app = express();
app.use(express.static("build"));
app.use(express.json());



// Register the middleware
app.use(setCookie);
app.get("/get", getTodos);
app.post("/delete", deleteTodo);
app.post("/add", addTodo);
app.post("/edit", editTodo);
app.post("/completeSign", MarkTodoAsDone);

module.exports = app;
