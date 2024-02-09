let DATA = [];
let cFlag = [];
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
const clickSubmit = async(url, body) => {
  const value = document.getElementById("text").value;
  if (value != "") {
    await postReq(url,body);
 
    hideInput();
   
  }
};
const postReq = async(url,body) => {
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const post = await fetch(url, params);
  const data = await post.json();
  DATA = data.items;
  cFlag = data.completeFlag;
 
}
const hideInput = () => {
  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "none";
  document.getElementById("text").value = "";

  isEditable.isEdited = false;
  showItems();
}

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
  clickSubmit(url, body);
};

const showItems = () => {
  const list = document.getElementsByTagName("ul")[0];
let no_of_completed=0;
  list.innerHTML = "";
  DATA.forEach((item, index) => {
    const div = createElement("div");
    div.setAttribute("id", "items");
    // div.setAttribute("onclick","completed()");
    div.innerHTML = `<li id = "li" onclick = "completed('${index}')">${item}</li><button id="edit" onclick = "handleEdit('${item}','${index}')" ><img src="pen-to-square-solid.svg"></button><button id="delete" onclick = "handleDelete('${index}')"><img src="dustbin.jpeg"></button>`;
    list.appendChild(div);
    if(cFlag[index]){
      showCompleteColour(index);
      no_of_completed = no_of_completed+1;
    }
  });
  let total = cFlag.length;
  document.getElementsByTagName("h1")[0].innerText = `Completed: ${no_of_completed}/${total}`;
};

const handleEdit = (item, index) => {
  document.getElementById("delete").disabled = true;
  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "";
  document.getElementById("text").value = item;

  //-------------------
  isEditable.isEdited = true;
  isEditable.index = index;
  //-------------------
};
const completed = async(index) => {
console.log("----------clicked");
showCompleteColour(index);
 const url = "/completeSign";
 body = {
  index
 }
 await postReq(url,body);
 showItems();

}
const showCompleteColour = (index) => {
  const divTag = document.querySelectorAll("#items")[index];
  divTag.style.pointerEvents = "none";
  divTag.style.cursor = "none";
  divTag.style.backgroundColor = "#5a6b59";
  divTag.style.textShadow = "none";

  const ul = document.getElementsByClassName("list")[0];
  const newDiv = createElement("div");
  newDiv.setAttribute("id","complete_div");

  const doneTag = createElement("img");
  doneTag.setAttribute("src","done.jpeg");
  doneTag.setAttribute("id","done")
  doneTag.style.backgroundColor = "#5a6b59";
  newDiv.appendChild(doneTag);
  newDiv.appendChild(divTag);

  ul.appendChild(newDiv);

  
}
const handleDelete = async(index) => {
  const url = "/delete";
  body = {
    index
  }
  await postReq(url,body);
  showItems();
    
};
const handleCancel = () => {
  const input_div = document.getElementsByClassName("input-div")[0];
  input_div.style.display = "none";
  document.getElementById("text").value = "";
  isEditable.isEdited = false;
  document.getElementById("delete").disabled = false;
};

const main = async () => {
  document.getElementsByClassName("add")[0].addEventListener("click", addInput);
  document.getElementById("submit").addEventListener("click", handleSubmit);
  document.getElementById("cancel").addEventListener("click", handleCancel);
  // improve
  const response = await getRequest("/get")
  DATA = response.items;
  cFlag = response.completeFlag;
  showItems();
};
