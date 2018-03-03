const router = require('express').Router();
const genres = require('./genres');
const genresStartIndex = require('./genres-start-index');
const genresMaxResults = require('./genres-max-results');
const genreWithId = require('./genre-with-id');
const booksWithGenre = require('./books-with-genre');
const orderBooks = require('../books/order-books');
const booksStartIndex = require('../books/books-start-index');
const booksMaxResults = require('../books/books-max-results');


router.get('/', [genres, genresStartIndex, genresMaxResults]);
router.get('/:id', genreWithId);
router.get('/:id/books', [booksWithGenre, orderBooks, booksStartIndex, booksMaxResults]);

module.exports = router;
