const express = require('express');
const {
    getData
    ,postItem
    , replaceItem
    , deleteData
    , disableItem
} = require('./logic');

const app = express();
app.use(express.static('build'))
app.use(express.json());

app.get('/get',getData);
 app.post('/delete', deleteData);
app.post('/add',postItem);
 app.post('/edit',replaceItem);
 app.post('/completeSign', disableItem)

module.exports = app;