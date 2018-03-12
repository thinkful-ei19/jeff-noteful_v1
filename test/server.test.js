'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {
  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });
});

describe('Express static', function () {
  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function () {
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/bad/path')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('GET method', function() { 
  it ('should return a list with the correct fields', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys('id', 'title', 'content');
        });
      });
  });
});


describe('PUT method', function() {
  it('should update a note by its ID', function() {
    const updateData = {
      'title': 'updated title',
      'content': 'updated content'
    };
    return chai.request(app)
      .put('/api/notes/1005')
      .send(updateData)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.title).to.equal('updated title');
        expect(res.body.content).to.equal('updated content');
      });
  });  
  it('404 for invalid id', function() {
    const updateData = {
      'title': 'updated title',
      'content': 'updated content'
    };
    return chai.request(app)
      .put('/api/notes/2000')
      .send(updateData)
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});

describe('POST method', function() {
  it('should create and replace a new note if data is valid', function() {
    const newNote = {
      'title': 'test title',
      'content': 'testing post method content'
    };
    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.title).to.equal(newNote.title);
        expect(res.body.content).to.equal(newNote.content);
      });
  });
//   it('should return an error when missing "title" field', function () {
//     const updateItem = {
//       'foo': 'bar'
//     };
//     return chai.request(server)
//       .put('/api/notes/9999')
//       .send(updateItem)
//       .catch(err => err.response)
//       .then(res => {
//         expect(res).to.have.status(400);
//         expect(res).to.be.json;
//         expect(res.body).to.be.a('object');
//         expect(res.body.message).to.equal('Missing `title` in request body');
//       });
//   });

});

describe('DELETE method', function() {
  it('should delete item', function() {
    return chai.request(app)
      .delete('/api/notes/1005')
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
  it('should respond 404 for invalid deletion', function() {
    return chai.request(app)
      .delete('/api/notes/2000')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
});