const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// Get All (and search by query)
router.get('/notes', (req, res, next) => {
 // remove for brevity
});

// Get a single item
router.get('/notes/:id', (req, res, next) => {
 // remove for brevity
});

// Put update an item
router.put('/notes/:id', (req, res, next) => {
 // remove for brevity
});

module.exports = router;