let DATA = [];
let isEditable = {
  isEdited: false,
};

const getRequest = (url) => {
  return fetch(url).then((response) => response.json());
};

// improve
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

// improve
const clickSubmit = async (url, body) => {
  const value = document.getElementById("text").value;
  const date = document.getElementById("date").value;
  if (value != "" || date != "") {
    await postReq(url, body);

    hideInput();
  }
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
  document.querySelector(".add").disabled = false;

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
  clickSubmit(url, body);
};

const showItems = () => {
  const list = document.getElementsByTagName("ul")[0];

  list.innerHTML = "";
  const uniqueDates = new Set();
  DATA.forEach((item) => {
    uniqueDates.add(item.date);
    console.log(item.id+" ---------------"+item.isCompleted);
  });
  // displayItemsInEachDate(uniqueDates,list);
  uniqueDates.forEach((date, index) => {
    let no_of_completed = 0;
    const x = DATA.filter((obj) => obj.date === date);
    console.log(x);
    const calendar_div = createElement("div");
    calendar_div.setAttribute("id", "calendar"+index);
    calendar_div.setAttribute("class","calendar");
    list.appendChild(calendar_div);

    //  const date2 = date.split("-");

    // const newDate = date2[0] + " " + date2[1] + ", " + date2[2];
    const calendar_heading = createElement("div");
    calendar_heading.setAttribute("class","calendar_heading");
    calendar_div.appendChild(calendar_heading);
    const newDate = date;

    const calendar_text = createElement("h3");
    calendar_text.textContent = newDate;
    calendar_heading.appendChild(calendar_text);

    const completed_count = createElement("h4");
    completed_count.textContent =  "Completed: " + no_of_completed + "/" + x.length;
    calendar_heading.appendChild(completed_count);

    x.forEach((item) => {
      const div = createElement("div");
      div.setAttribute("class", "row");
      div.setAttribute("id", "items" + item.id);
      // div.setAttribute("onclick","completed()");
      div.innerHTML = `<li id = "li" onclick = "completed('${item.id}', '${index}')">${item.item}</li><button id="edit" onclick = "handleEdit('${item.item}','${item.date}','${item.id}')" ><img src="pen-to-square-solid.svg"></button><button id="delete" onclick = "handleDelete('${item.id}')"><img src="dustbin.jpeg"></button>`;
      calendar_div.appendChild(div);
      if (item.isCompleted) {
        showCompleteColour(item.id, index);
        no_of_completed = no_of_completed + 1;
      }
    });
    completed_count.textContent =  "Completed: " + no_of_completed + "/" + x.length;

  });
  
};

const handleEdit = (text, date, index) => {
  // document.getElementById("delete"+index).disabled = true;
  document.getElementById("items"+index).children.delete.disabled=true;
  document.getElementById("items"+index).style.pointerEvents = "none";
  document.querySelector(".add").disabled = true;

  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "";
  document.getElementById("text").value = text;
  document.getElementById("date").value = date;

  //-------------------
  isEditable.isEdited = true;
  isEditable.index = index;
  //-------------------
};
const completed = async (id,index) => {
  showCompleteColour(id,index);
  const url = "/completeSign";
  body = {
    id,
  };
  await postReq(url, body);
  showItems();
};
const showCompleteColour = (id,index) => {
  const divTag = document.getElementById("items" + id);
  divTag.style.pointerEvents = "none";
  divTag.style.cursor = "none";
  divTag.style.backgroundColor = "#5a6b59";
  divTag.style.textShadow = "none";

  const calendarID = document.getElementById("calendar"+index);
  const newDiv = createElement("div");
  newDiv.setAttribute("id", "complete_div");

  const doneTag = createElement("img");
  doneTag.setAttribute("src", "done.jpeg");
  doneTag.setAttribute("id", "done");
  doneTag.style.backgroundColor = "#5a6b59";
  newDiv.appendChild(doneTag);
  newDiv.appendChild(divTag);

  calendarID.appendChild(newDiv);
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
  document.getElementById("items"+isEditable.index).style.pointerEvents = "";
  document.querySelectorAll("#delete").forEach((ele) => (ele.disabled = false));
  document.querySelector(".add").disabled = false;
};

const main = async () => {
  document.getElementsByClassName("add")[0].addEventListener("click", addInput);
  document.getElementById("submit").addEventListener("click", handleSubmit);
  document.getElementById("cancel").addEventListener("click", handleCancel);

  DATA = await getRequest("/get");
  showItems();
};
