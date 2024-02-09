let data = [];

const getData = (req, res) => {
  res.send(data);
};

const postItem = (req, res) => {
  const item = req.body.value;
  const obj = {
    item,
    isCompleted:false
  }
  data.unshift(obj);
  res.send(data);
};

const replaceItem = (req, res) => {
  const new_item = req.body.value;
  const index = req.body.index;
  const obj = {
    item:new_item,
    isCompleted:false
  }
  data.splice(index, 1, obj);
  res.send(data);
};

const deleteData = (req, res) => {
  const id = req.body.index;
  data.splice(id, 1);
  res.send(data);
};

const disableItem = (req, res) => {
  const index = req.body.index;
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
