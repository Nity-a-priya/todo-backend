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

const cookieCount = 1

app.get("/addCookie", (req, res)=>{
  res.setHeader('Set-Cookie', 'user4');
  res.send("Success");
});
// middleware

const myMiddleware = (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    res.setHeader('Set-Cookie', 'user4');
  }
  next(); // Pass control to the next middleware function
};

// Register the middleware
app.use(myMiddleware);
app.get("/get", getTodos);
app.post("/delete", deleteTodo);
app.post("/add", addTodo);
app.post("/edit", editTodo);
app.post("/completeSign", MarkTodoAsDone);

module.exports = app;
