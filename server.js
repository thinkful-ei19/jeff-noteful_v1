'use strict';

// TEMP: Simple In-Memory Database
// const data = require('./db/notes');

// console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const data = require('./db/notes');

const app = express();
app.use(express.static('public'));

// Listen for incoming connections
app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

app.get('/api/notes', (req, res) => {
  res.json(data);
});

app.get('/api/notes/:id', function (req, res) {
  res.json(data.find(item => item.id === Number(req.params.id)))
})

app.get('/api/notes/', (req, res) => {
  //http://localhost:8080/api/notes/?searchTerm=cats
  const searchTerm = req.query.searchTerm;
  const filteredNote = data.filter(note => note.title.includes(searchTerm)) ;
  res.json(filteredNote);
});