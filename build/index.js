

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

const handleSubmit = async() => {
    const input_div = document.getElementsByClassName("input-div")[0];
  const value = document.getElementById("text").value;
  if(value!=""){
  const body = {
    value: value
  }
  const url = '/add'
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }
  const post = await fetch(url,params);
  const data = await post.json();
input_div.style.display = 'none';
document.getElementById('text').value = "";

 
  showItems(data);
}

};

const showItems = (data) => {

    const list = document.getElementsByTagName('ul')[0];
    list.innerHTML = "";
    data.forEach(item => {
      const li = createElement("li");
      li.innerHTML = item;
      list.appendChild(li);
    });
}

const main = () => {
  document.getElementById("submit").addEventListener("click", handleSubmit);
  document.getElementsByClassName("add")[0].addEventListener("click", addInput);
};
