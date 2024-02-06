let items = [];

const getData = (req,res) => {
    
res.send(items);
}

const postItem = (req,res) => {
    const item = req.body.value;
     items = [item, ...items];
    res.send(items);
}

const replaceItem = (req,res) => {
    
    const new_item = req.body.value;
    const index = req.body.index;
    const changed = items.splice(index,1,new_item)
    res.send(items);
}

module.exports = {postItem, replaceItem, getData};