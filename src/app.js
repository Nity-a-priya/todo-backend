const express = require('express');
const {postItem} = require('./logic');

const app = express();
app.use(express.static('build'))
app.use(express.json());

app.post('/add',postItem);

module.exports = app;