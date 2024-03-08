// [
//   {
//     user_id: "user1",
//     DATA: [{ id: 1, item: "as", date: "2024-03-06", isCompleted: false }],
//   },
// ];

// {
//   cookie1: "user1";
// }

let USERS = [];
let COOKIE_DB = {};

const generateCookie = (() => {
  let cookieCount = 0;
  return () => {
    cookieCount++;
    return cookieCount;
  };
})();

const generateId = (() => {
  let id = 0;
  return () => {
    id++;
    return id;
  };
})();

const getMatchingIndex = (todos, id) => {
  return todos.findIndex((todo) => todo.id == id);
};

const getMatchingUser = (cookieHeader) => {
  return USERS.findIndex((user) => user.cookie == cookieHeader);
};

const setCookie = (req, res, next) => {
  let cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    cookieHeader = `user${generateCookie()}`;
    USERS.push({ cookie: cookieHeader, DATA: [] });
    res.setHeader("Set-Cookie", cookieHeader);
  }
  req.app.locals.cookie = cookieHeader;
  next(); // Pass control to the next middleware function
};

const checkIsValidUser = (req, res, next) => {
  let cookie = req.headers.cookie;
  if (cookie in COOKIE_DB) {
    next();
  }
  res.redirect("/login.html");
};

const getuserData = (cookieHeader) => {
  const user_index = getMatchingUser(cookieHeader);
  return [...USERS[user_index].DATA];
};

const getTodos = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  const todosData = getuserData(cookieHeader);
  res.send(todosData);
};

const addTodo = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  const text = req.body.value;
  const date = req.body.date;
  const id = generateId();
  const obj = {
    id,
    item: text,
    date,
    isCompleted: false,
  };

  const data = getuserData(cookieHeader);
  data.unshift(obj);
  let user_index = getMatchingUser(cookieHeader);
  USERS[user_index].DATA = data;
  res.send(USERS[user_index].DATA);
};

const editTodo = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  const new_text = req.body.value;
  const new_date = req.body.date;
  const id = req.body.index;
  const newTodo = {
    id,
    item: new_text,
    date: new_date,
    isCompleted: false,
  };
  let data = getuserData(cookieHeader);
  const index = getMatchingIndex(data, id);
  data.splice(index, 1, newTodo);
  let user_index = getMatchingUser(cookieHeader);
  USERS[user_index].DATA = data;
  res.send(USERS[user_index].DATA);
};

const deleteTodo = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  const id = req.body.index;
  let data = getuserData(cookieHeader);
  const index = getMatchingIndex(data, id);
  data.splice(index, 1);
  let user_index = getMatchingUser(cookieHeader);
  USERS[user_index].DATA = data;
  res.send(USERS[user_index].DATA);
};

const MarkTodoAsDone = (req, res) => {
  const todoId = req.body.id;
  const cookieHeader = req.app.locals.cookie;
  let user_index = getMatchingUser(cookieHeader);
  const data = getuserData(cookieHeader);
  const todoIndex = getMatchingIndex(data, todoId);
  data[todoIndex].isCompleted = true;
  USERS[user_index].DATA = data;
  res.send(USERS[user_index].DATA);
};

module.exports = {
  setCookie,
  addTodo,
  editTodo,
  getTodos,
  deleteTodo,
  MarkTodoAsDone,
  checkIsValidUser,
};
