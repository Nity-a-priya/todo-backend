let DATA = [];
let isEditable = {
  isEdited: false,
};

const getRequest = (url) => {
  return fetch(url).then((response) => response.json());
};
const createElement_class_id_AddParent = (ele, classname, id, parent) => {
  const element = createElement(ele);
  if (classname != "") {
    element.className = classname;
  }
  if (id != "") {
    element.id = id;
  }
  parent.appendChild(element);
  return element;
};

const addInput = () => {
  const input_div = document.getElementsByClassName("input-div")[0];
  if (input_div.style.display === "none") {
    input_div.style.display = "";
  } else {
    input_div.style.display = "none";
  }
};

const createElement = (ele) => {
  const element = document.createElement(ele);
  return element;
};

const clickSubmit = async (url, body) => {
  await postReq(url, body);
  hideInput();
};
const postReq = async (url, body) => {
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const post = await fetch(url, params);
  const data = await post.json();
  DATA = data;
};
const hideInput = () => {
  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "none";
  document.getElementById("text").value = "";
  document.getElementById("date").value = "";

  isEditable.isEdited = false;
  showItems();
};

const handleSubmit = () => {
  const value = document.getElementById("text").value;
  const date = document.getElementById("date").value;
  const addButton = document.querySelector(".add");
  addButton.disabled = false;
  addButton.style.cursor = "pointer";

  let url = "/add";
  let body = {
    value,
    date,
  };
  if (isEditable.isEdited) {
    body = {
      value,
      date,
      index: isEditable.index,
    };
    url = "/edit";
  }
  if (value != "" && date != "") {
    clickSubmit(url, body);
  }
};

const createCalendarHeading = (
  calendar_div,
  no_of_completed,
  calendarToDo,
  date
) => {
  const calendar_heading = createElement_class_id_AddParent(
    "div",
    "calendar_heading",
    "",
    calendar_div
  );

  const calendar_text = createElement_class_id_AddParent(
    "h3",
    "date",
    "",
    calendar_heading
  );
  calendar_text.textContent = date;

  const completed_count = createElement_class_id_AddParent(
    "h4",
    "count",
    "",
    calendar_heading
  );
  completed_count.textContent =
    "Completed: " + no_of_completed + "/" + calendarToDo.length;

  return completed_count;
};

const showEachToDo = (item, calendar_body, index) => {
  const todo = createElement_class_id_AddParent(
    "div",
    "row",
    "items" + item.id,
    calendar_body
  );

  todo.innerHTML = `<li id = "li" onclick = "completed('${item.id}', '${index}')">${item.item}</li><button id="edit" onclick = "handleEdit('${item.item}','${item.date}','${item.id}')" ><img src="pen-to-square-solid.svg"></button><button id="delete" onclick = "handleDelete('${item.id}')"><img src="dustbin.jpeg"></button>`;
};

const displayToDos = (dateWiseTodos, list, index) => {
  let no_of_completed = 0;
  const calendarToDo = dateWiseTodos.todos;

  const outer_calendar_div = createElement_class_id_AddParent(
    "div",
    "outer_calendar",
    "",
    list
  );

  const calendar_div = createElement_class_id_AddParent(
    "div",
    "calendar",
    "calendar" + index,
    outer_calendar_div
  );

  const completed_count = createCalendarHeading(
    calendar_div,
    no_of_completed,
    calendarToDo,
    dateWiseTodos.date
  );
  // const calendar_body = createElement("div");
  // calendar_body.setAttribute("class", "calendar_body");
  // calendar_div.appendChild(calendar_body);

  const calendar_body = createElement_class_id_AddParent(
    "div",
    "calendar_body",
    "calendar_body" + index,
    calendar_div
  );

  calendarToDo.forEach((item) => {
    showEachToDo(item, calendar_body, index);
    if (item.isCompleted) {
      showCompleteColour(item.id, index);
      no_of_completed = no_of_completed + 1;
    }
  });
  completed_count.textContent =
    "Completed: " + no_of_completed + "/" + calendarToDo.length;
};

const getDatesWiseTodos = (data) => {
  return data.reduce((datesWiseTodos, todo) => {
    const index = datesWiseTodos.findIndex(
      (dateWiseTodo) => dateWiseTodo.date === todo.date
    );

    if (index === -1) {
      return [...datesWiseTodos, { date: todo.date, todos: [todo] }];
    } else {
      datesWiseTodos[index].todos.push(todo);
      return [...datesWiseTodos];
    }

    // [{date: date, todos:[{id:,item:,date:},{...}]}]
  }, []);
};

const sortDates = (array) => {
  return array.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
};

const showItems = () => {
  const list = document.getElementsByTagName("ul")[0];

  list.innerHTML = "";

  const datesWiseTodos = getDatesWiseTodos(DATA);

  const sortedDatewiseTodos = sortDates(datesWiseTodos);
  sortedDatewiseTodos.forEach((dateWiseTodos, index) => {
    displayToDos(dateWiseTodos, list, index);
  });
};

const handleEdit = (text, date, index) => {
  const item = document.getElementById("items" + index);
  item.children.delete.disabled = true;
  item.style.pointerEvents = "none";
  item.style.cursor = "not-allowed";
  const addButton = document.querySelector(".add");
  addButton.disabled = true;
  addButton.style.cursor = "not-allowed";

  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "";
  document.getElementById("text").value = text;
  document.getElementById("date").value = date;

  //-------------------
  isEditable.isEdited = true;
  isEditable.index = index;
  //-------------------
};
const completed = async (id, index) => {
  showCompleteColour(id, index);
  const url = "/completeSign";
  body = {
    id,
  };
  await postReq(url, body);
  showItems();
};
const showCompleteColour = (id, index) => {
  const calendarID = document.getElementById("calendar_body" + index);

  const newDiv = createElement_class_id_AddParent(
    "div",
    "complete_div",
    "",
    calendarID
  );
  const doneTag = createElement_class_id_AddParent("img", "", "done", newDiv);
  doneTag.setAttribute("src", "done.jpeg");
  doneTag.style.backgroundColor = "#5a6b59";

  const divTag = document.getElementById("items" + id);
  divTag.style.pointerEvents = "none";
  divTag.style.backgroundColor = "rgb(46, 61, 45)";
  divTag.style.textShadow = "none";
  newDiv.appendChild(divTag);

  divTag.children.delete.disabled = true;
  divTag.children.edit.disabled = true;
};

const handleDelete = async (index) => {
  const url = "/delete";
  body = {
    index,
  };
  await postReq(url, body);
  showItems();
};
const handleCancel = () => {
  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "none";
  document.getElementById("text").value = "";
  document.getElementById("date").value = "";
  isEditable.isEdited = false;
  document.getElementById("items" + isEditable.index).style.pointerEvents = "";
  document.querySelectorAll("#delete").forEach((ele) => {
    ele.disabled = false;
    ele.style.cursor = "pointer";
  });
  const addButton = document.querySelector(".add");
  addButton.disabled = false;
  addButton.style.cursor = "pointer";
};

const main = async () => {
  document.getElementsByClassName("add")[0].addEventListener("click", addInput);
  document.getElementById("submit").addEventListener("click", handleSubmit);
  document.getElementById("cancel").addEventListener("click", handleCancel);

  DATA = await getRequest("/get");
  showItems();
};
