let data = [
  {
    id:22,
    item:"nitya",
    date:'2024-02-19'

  },{
    id:23,
    item:"priya",
    date:'2024-02-20'
  },{
    id:24,
    item:"venky",
    date:'2024-02-20'
  },{
    id:25,
    item:"setti",
    date:'2024-02-19'
  }
];
let id = 0;

const getData = (req, res) => {
  res.send(data);
};

const postItem = (req, res) => {
  const item = req.body.value;
  const date = req.body.date;
  const obj = {
    id:id+1,
    item,
    date,
    isCompleted:false
  }
  data.unshift(obj);
  id++;
  res.send(data);
};

const replaceItem = (req, res) => {
  const new_item = req.body.value;
  const new_date = req.body.date;
  const id = req.body.index;
  const obj = {
    id,
    item:new_item,
    date:new_date,
    isCompleted:false
  }
  const index = data.findIndex( obj => obj.id == id);
  data.splice(index, 1, obj);
  res.send(data);
};

const deleteData = (req, res) => {
  const id = req.body.index;
  const index = data.findIndex( obj => obj.id == id);
  data.splice(index, 1);
  res.send(data);
};

const disableItem = (req, res) => {
  const id = req.body.id;
  const index = data.findIndex( obj => obj.id == id);
  data[index].isCompleted = true;
  res.send(data);
};

module.exports = {
   postItem,
   replaceItem,
  getData,
    deleteData,
   disableItem
};
