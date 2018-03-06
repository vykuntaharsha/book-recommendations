const router = require('express').Router();
const books = require('./books');
const searchWithFilters = require('../search/search-with-filters');
const searchWithKeyWords = require('../search/search-with-keywords');
const orderBooks = require('./order-books');
const booksStartIndex = require('./books-start-index');
const booksMaxResults = require('./books-max-results');
const bookWithId = require('./book-with-id');
const updateBook = require('./update-book');
const updateBookVotes = require('./update-book-votes');

router.get('/', [books, orderBooks, booksStartIndex, booksMaxResults]);
router.get('/search', [books, searchWithFilters, searchWithKeyWords, orderBooks, booksStartIndex, booksMaxResults]);
router.get('/:id', bookWithId);
router.put('/:id', updateBook);
router.put('/:id/votes', updateBookVotes);

module.exports = router;
