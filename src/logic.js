let items = [];
const postItem = (req,res) => {
    const item = req.body.value;
     items = [item, ...items];
    res.send(items);
}

module.exports = {postItem};