const express = require("express");
const {
  setCookie,
  getTodos,
  addTodo,
  editTodo,
  deleteTodo,
  MarkTodoAsDone,
  checkIsValidUser,
  logRequest,
} = require("./logic");

const app = express();

app.use(logRequest);
app.use(express.static("build"));
app.use(express.json());

// Register the middleware
app.use(checkIsValidUser);

app.use(setCookie);
app.get("/get", getTodos);
app.post("/delete", deleteTodo);
app.post("/add", addTodo);
app.post("/edit", editTodo);
app.post("/completeSign", MarkTodoAsDone);

module.exports = app;
