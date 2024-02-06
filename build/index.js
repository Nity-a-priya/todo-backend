let DATA = [];
let isEmpty = true;
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

const createElement = (ele) => {
  const element = document.createElement(ele);
  return element;
};

const submit = async (url, body) => {
  const input_div = document.getElementsByClassName("input-div")[0];
  const value = document.getElementById("text").value;
  if (value != "") {
    const params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const post = await fetch(url, params);
    const data = await post.json();
    input_div.style.display = "none";
    document.getElementById("text").value = "";

    DATA = data;
    isEditable.isEdited = false;
    return showItems();
  }
};

const handleSubmit = () => {
  const value = document.getElementById("text").value;
  let url = "/add";
  let body = {
    value: value,
  };
  if (isEditable.isEdited) {
    body = {
      value,
      index: isEditable.index,
    };
    url = "/edit";
  }
  submit(url, body);
  
};

const showItems = () => {
  const list = document.getElementsByTagName("ul")[0];

  if (!isEmpty) list.innerHTML = "";
  DATA.forEach((item, index) => {
    const div = createElement("div");
    div.setAttribute("id", "items");
    div.innerHTML = `<li id = "li">${item}</li><button id="edit" onclick = "handleEdit('${item}','${index}')" ><img src="pen-to-square-solid.svg"></button>`;
    list.appendChild(div);
  });
  isEmpty = false;
};

const handleEdit = (item, index) => {
  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "";
  document.getElementById("text").value = item;

  //-------------------
  isEditable.isEdited = true;
  isEditable.index = index;
  //-------------------
};
const handleCancel = () => {
  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "none";
  document.getElementById("text").value = "";
  isEditable.isEdited=false;
}

const main = () => {
  document.getElementsByClassName("add")[0].addEventListener("click", addInput);

  document.getElementById("submit").addEventListener("click", handleSubmit);
  document.getElementById("cancel").addEventListener("click",handleCancel);
  // document.getElementById("edit").addEventListener("click",handleEdit);
  fetch("/get")
    .then((response) => response.json())
    .then((data) => {
      DATA = data;
      showItems();
    });
};
