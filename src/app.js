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
  logoutUser
} = require("./logic");

const app = express();

app.use(cookieParser());
app.use(logRequest);
app.use(express.static("build"));
app.use(express.json());

app.get("/auth/github", authorizeGithub);
app.get("/auth/github/callback", authenticateAndRedirect);

app.use(readCookie);
app.use(checkIsValidUser);



app.get("/get", getTodos);
app.post("/delete", deleteTodo);
app.post("/add", addTodo);
app.post("/edit", editTodo);
app.post("/completeSign", MarkTodoAsDone);
app.get("/logout",logoutUser);

module.exports = app;
