'use strict';

// TEMP: Simple In-Memory Database
// const data = require('./db/notes');

// console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const data = require('./db/notes');

const simDB = require('./db/simDB');

const notes = simDB.initialize(data);

const {PORT} = require('./config')

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.use(function (req,res,next) {
  console.log('Time:',Date(),req.method,req.url)
  next();
  })


// Using the GET METHOD
app.get('/api/notes',(req,res,next)=>{
  const {searchTerm} = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    console.log(list);
    res.json(list)
  });
})

app.get('/api/notes/:id', function (req, res) {
  console.log(req.params)
  const {id} = req.params;
  notes.find(id, (err, item) => {
    if (err) {
      console.error(err);
    }
    if (item) {
      res.json(data.find(item => item.id === Number(id)))
      console.log(item);
    } else {
      console.log('not found');
    }
  });
})


// app.get('/api/notes/', (req, res) => {
//   //http://localhost:8080/api/notes/?searchTerm=cats
//   const searchTerm = req.query.searchTerm;
//   const filteredNote = data.filter(note => note.title.includes(searchTerm)) ;
//   res.json(filteredNote);
// });


// Never put in production BOOM!!! 
// app.get('/boom', (req, res, next) => {
//   throw new Error('Boom!!');
// });

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});
//Listen for Error-Handling Middleware
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});
//Custom 404 handler
app.use(function(err,req,res,next){
  res.status(err.status || 500);
  res.json({
    message:err.message,
    error:err
  })
})
// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});