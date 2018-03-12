const api = require('express').Router();

const genres = require('./genres');
const books =  require('./books');
const authors = require('./autohrs');

api.use('/genres', genres);
api.use('/books', books);
api.use('/authors', authors);

module.exports = api;
