const express = require("express");
const {
  getTodos,
  addTodo,
  editTodo,
  deleteTodo,
  MarkTodoAsDone,
} = require("./logic");

const app = express();
app.use(express.static("build"));
app.use(express.json());

app.get("/get", getTodos);
app.post("/delete", deleteTodo);
app.post("/add", addTodo);
app.post("/edit", editTodo);
app.post("/completeSign", MarkTodoAsDone);

module.exports = app;
