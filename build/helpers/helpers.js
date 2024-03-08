const getRequest = (url) => {
  return fetch(url).then((response) => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  });
};

const postReq = async (url, body) => {
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  return fetch(url, params).then((response) => {
    if (response.redirected) {
      window.location.href = response.url;
    }
    return response.json();
  });
};

const createElement_class_id_AddParent = (ele, classname, id, parent) => {
  const element = document.createElement(ele);
  if (classname != "") {
    element.className = classname;
  }
  if (id != "") {
    element.id = id;
  }
  parent.appendChild(element);
  return element;
};

const enableAddButton = () => {
  const addButton = document.querySelector(".add");
  addButton.disabled = false;
  addButton.style.cursor = "pointer";
};

const disableAddButton = () => {
  const addButton = document.querySelector(".add");
  addButton.disabled = true;
  addButton.style.cursor = "not-allowed";
};

const deleteButtonStatus = (
  element,
  disability,
  pointer_events,
  cursorType
) => {
  element.children.delete.disabled = disability;
  element.style.pointerEvents = pointer_events;
  element.style.cursor = cursorType;
};

const sortDates = (array) => {
  return array.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
};
