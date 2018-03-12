const api = require('express').Router();

const genres = require('./genres');
const books =  require('./books');

api.use('/genres', genres);
api.use('/books', books);

module.exports = api;
