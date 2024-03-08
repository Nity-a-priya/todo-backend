const axios = require("axios");

let USERS = [];
let COOKIE_DB = {};
const CLIENT_ID = "e23612d3c1afaf0fd348";
const CLIENT_SECTRET = "b1b65d7cbe6cf13b65131ee0cd339fa3f2237cef";

const generateCookie = (() => {
  let cookieCount = 0;
  return () => {
    cookieCount++;
    return `cookie-${cookieCount}`;
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

const getMatchingUserIndex = (userID) => {
  return USERS.findIndex((user) => user.user_id == userID);
};

const readCookie = (req, res, next) => {
  req.app.locals.cookie = req.cookies.cookie;
  next();
};

const checkIsValidUser = (req, res, next) => {
  const cookie = req.app.locals.cookie;
  if (cookie in COOKIE_DB) {
    next();
  } else {
    res.redirect("/login.html");
  }
};

const authorizeGithub = (req, res) => {
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}`;
  res.redirect(url);
};

const authenticateAndRedirect = (req, res) => {
  const code = req.query.code;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };
  axios
    .post(
      `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECTRET}&code=${code}`,
      { headers }
    )
    .then((response) => {
      let [access_token] = response.data.split("&");
      access_token = access_token.split("=")[1];
      const headers = { Authorization: `token ${access_token}` };
      axios.get(`https://api.github.com/user`, { headers }).then((resp2) => {
        const cookie = createSession(resp2.data.login);
        res.cookie("cookie", cookie);
        res.redirect("/");
      });
    });
};

const createUserIfDoesntExist = (userID) => {
  if (getMatchingUserIndex(userID) == -1) {
    USERS.push({ user_id: userID, DATA: [] });
  }
};

const createCookieEntryInCookieDB = (userID) => {
  const cookie = generateCookie();
  COOKIE_DB[cookie] = userID;
  return cookie;
};

const createSession = (userID) => {
  createUserIfDoesntExist(userID);
  return createCookieEntryInCookieDB(userID);
};

const getuserData = (userID) => {
  const user_index = getMatchingUserIndex(userID);
  return [...USERS[user_index].DATA];
};

const getTodos = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  const userID = COOKIE_DB[cookieHeader];
  const todosData = getuserData(userID);
  res.json(todosData);
};

const addTodo = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  const userID = COOKIE_DB[cookieHeader];
  const text = req.body.value;
  const date = req.body.date;
  const id = generateId();
  const obj = {
    id,
    item: text,
    date,
    isCompleted: false,
  };

  const data = getuserData(userID);
  data.unshift(obj);
  let user_index = getMatchingUserIndex(userID);
  USERS[user_index].DATA = data;
  res.send(USERS[user_index].DATA);
};

const editTodo = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  const userID = COOKIE_DB[cookieHeader];
  const new_text = req.body.value;
  const new_date = req.body.date;
  const id = req.body.index;
  const newTodo = {
    id,
    item: new_text,
    date: new_date,
    isCompleted: false,
  };
  let data = getuserData(userID);
  const index = getMatchingIndex(data, id);
  data.splice(index, 1, newTodo);
  let user_index = getMatchingUserIndex(userID);
  USERS[user_index].DATA = data;
  res.send(USERS[user_index].DATA);
};

const deleteTodo = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  const userID = COOKIE_DB[cookieHeader];
  const id = req.body.index;
  let data = getuserData(userID);
  const index = getMatchingIndex(data, id);
  data.splice(index, 1);
  let user_index = getMatchingUserIndex(userID);
  USERS[user_index].DATA = data;
  res.send(USERS[user_index].DATA);
};

const MarkTodoAsDone = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  const userID = COOKIE_DB[cookieHeader];
  const todoId = req.body.id;
  let user_index = getMatchingUserIndex(userID);
  const data = getuserData(userID);
  const todoIndex = getMatchingIndex(data, todoId);
  data[todoIndex].isCompleted = true;
  USERS[user_index].DATA = data;
  res.send(USERS[user_index].DATA);
};

const logoutUser = (req, res) => {
  const cookieHeader = req.app.locals.cookie;
  delete COOKIE_DB[cookieHeader];
  res.clearCookie("cookie");
  res.redirect("/");
};

const logRequest = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};

module.exports = {
  readCookie,
  addTodo,
  editTodo,
  getTodos,
  deleteTodo,
  MarkTodoAsDone,
  checkIsValidUser,
  logRequest,
  authorizeGithub,
  authenticateAndRedirect,
  logoutUser,
};
