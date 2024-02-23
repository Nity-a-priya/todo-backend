let DATA = [
  {
    id: 22,
    item: "nitya",
    date: "2024-02-19",
  },
  {
    id: 23,
    item: "priya",
    date: "2024-02-20",
  },
  {
    id: 24,
    item: "venky",
    date: "2024-02-20",
  },
  {
    id: 25,
    item: "setti",
    date: "2024-02-19",
  },
];

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

const getTodos = (req, res) => {
  res.send(DATA);
};

const addTodo = (req, res) => {
  const text = req.body.value;
  const date = req.body.date;
  const id = generateId();
  const obj = {
    id,
    item: text,
    date,
    isCompleted: false,
  };
  DATA.unshift(obj);
  res.send(DATA);
};

const editTodo = (req, res) => {
  const new_text = req.body.value;
  const new_date = req.body.date;
  const id = req.body.index;
  const newTodo = {
    id,
    item: new_text,
    date: new_date,
    isCompleted: false,
  };
  const index = getMatchingIndex(DATA, id);
  DATA.splice(index, 1, newTodo);
  res.send(DATA);
};

const deleteTodo = (req, res) => {
  const id = req.body.index;
  const index = getMatchingIndex(DATA, id);
  DATA.splice(index, 1);
  res.send(DATA);
};

const MarkTodoAsDone = (req, res) => {
  const id = req.body.id;
  const index = getMatchingIndex(DATA, id);
  DATA[index].isCompleted = true;
  res.send(DATA);
};

module.exports = {
  addTodo,
  editTodo,
  getTodos,
  deleteTodo,
  MarkTodoAsDone,
};
