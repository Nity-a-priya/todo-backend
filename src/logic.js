let items = [];
let completeFlag = [];

const getData = (req, res) => {
  res.send({items,completeFlag});
};

const postItem = (req, res) => {
  const item = req.body.value;
  items = [item, ...items];
  completeFlag = [false, ...completeFlag];
  res.send({items,completeFlag});
};

const replaceItem = (req, res) => {
  const new_item = req.body.value;
  const index = req.body.index;
  const changed = items.splice(index, 1, new_item);
  res.send({items,completeFlag});
};

const deleteData = (req, res) => {
  const id = req.body.index;
  items.splice(id, 1);
  completeFlag.splice(id,1)
  res.send({items,completeFlag});
};

const disableItem = (req,res) => {
  const index = req.body.index;
  completeFlag[index] = true;
  res.send({items,completeFlag});
}

module.exports = { postItem, replaceItem, getData, deleteData, disableItem };
