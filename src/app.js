const express = require('express');
const {getData,postItem, replaceItem, deleteData} = require('./logic');

const app = express();
app.use(express.static('build'))
app.use(express.json());

app.get('/get',getData);
app.get('/delete', deleteData);
app.post('/add',postItem);
app.post('/edit',replaceItem);

module.exports = app;