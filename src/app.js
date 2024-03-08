const express = require("express");
const cookieParser = require('cookie-parser');
const {
  getTodos,
  addTodo,
  editTodo,
  deleteTodo,
  MarkTodoAsDone,
  checkIsValidUser,
  logRequest,
  authorizeGithub,
  authenticateAndRedirect,
  readCookie,
} = require("./logic");

const app = express();

app.use(cookieParser());
app.use(logRequest);
app.use(express.static("build"));
app.use(express.json());

app.get("/auth/github", authorizeGithub);
app.get("/auth/github/callback", authenticateAndRedirect);

app.use(checkIsValidUser);


// app.use(readCookie);

app.get("/get", getTodos);
app.post("/delete", deleteTodo);
app.post("/add", addTodo);
app.post("/edit", editTodo);
app.post("/completeSign", MarkTodoAsDone);

module.exports = app;
