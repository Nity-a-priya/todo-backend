const express = require('express');
const {getData,postItem, replaceItem} = require('./logic');

const app = express();
app.use(express.static('build'))
app.use(express.json());

app.get('/get',getData);
app.post('/add',postItem);
app.post('/edit',replaceItem);

module.exports = app;