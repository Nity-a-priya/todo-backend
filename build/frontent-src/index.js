let DATA = [];
let isEditable = {
  isEdited: false,
};

const addInput = () => {
  const input_div = document.getElementsByClassName("input-div")[0];
  if (input_div.style.display === "none") {
    input_div.style.display = "";
  } else {
    input_div.style.display = "none";
  }
};

const clickSubmit = async (url, body) => {
  DATA = await postReq(url, body);
  hideInput();
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
  enableAddButton();

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
  calendar_div.innerHTML = `
<div class = "calendar_heading">
    <h3 class="date">
    ${date}
    </h3>
    <h4 class="count">
    Completed: ${no_of_completed}/${calendarToDo.length}
    </h4>
</div>
`;
};

const showEachToDo = (item, calendar_body, index) => {
  const todo = createElement_class_id_AddParent(
    "div",
    "row",
    "items" + item.id,
    calendar_body
  );

  todo.innerHTML = `
  <li id = "li" onclick = "completed('${item.id}', '${index}')">
    ${item.item}
  </li>
  <button id="edit" onclick = "handleEdit('${item.item}','${item.date}','${item.id}')" >
    <img src="pen-to-square-solid.svg">
  </button>
  <button id="delete" onclick = "handleDelete('${item.id}')">
    <img src="dustbin.jpeg">
  </button>`;
};

const displayToDos = (no_of_completed, dateWiseTodos, list, index) => {
  const calendarToDo = dateWiseTodos.todos;

  list.innerHTML =
    list.innerHTML +
    `
  <div class="outer_calendar">
    <div class="calendar" id='calendar${index}'>

    </div>
  </div>
  `;

  const calendar_div = document.getElementById(`calendar${index}`);

  createCalendarHeading(
    calendar_div,
    no_of_completed,
    calendarToDo,
    dateWiseTodos.date
  );

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
  calendar_div.children[0].children[1].innerHTML =
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

const showItems = () => {
  const list = document.getElementsByTagName("ul")[0];

  list.innerHTML = "";

  const datesWiseTodos = getDatesWiseTodos(DATA);

  const sortedDatewiseTodos = sortDates(datesWiseTodos);
  sortedDatewiseTodos.forEach((dateWiseTodos, index) => {
    let no_of_completed = 0;
    displayToDos(no_of_completed, dateWiseTodos, list, index);
  });
};

const handleEdit = (text, date, index) => {
  const item = document.getElementById("items" + index);
  deleteButtonStatus(item, true, "none", "not-allowed");

  disableAddButton();

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
  DATA = await postReq(url, body);
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
  divTag.style.backgroundColor = "rgba(6, 65, 17, 0.51)";
  divTag.style.textShadow = "none";
  newDiv.appendChild(divTag);

  deleteButtonStatus(divTag, true, "none", "not-allowed");
  divTag.children.edit.disabled = true;
};

const handleDelete = async (index) => {
  const url = "/delete";
  body = {
    index,
  };
  DATA = await postReq(url, body);
  showItems();
};

const handleCancel = () => {
  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "none";
  document.getElementById("text").value = "";
  document.getElementById("date").value = "";
  isEditable.isEdited = false;
  const todo = document.getElementById("items" + isEditable.index);
  deleteButtonStatus(todo, false, "", "pointer");
  enableAddButton();
};

const main = async () => {
  document.getElementsByClassName("add")[0].addEventListener("click", addInput);
  document.getElementById("submit").addEventListener("click", handleSubmit);
  document.getElementById("cancel").addEventListener("click", handleCancel);

  DATA = await getRequest("/get");
  showItems();
};
