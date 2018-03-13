const router = require('express').Router();
const books = require('./books');
const searchWithFilters = require('../search/search-with-filters');
const searchWithKeyWords = require('../search/search-with-keywords');
const booksStartWith = require('./books-start-with');
const orderBooks = require('./order-books');
const booksStartIndex = require('./books-start-index');
const booksMaxResults = require('./books-max-results');
const bookWithId = require('./book-with-id');
const updateBook = require('./update-book');
const usersVotedForBook = require('./users-voted-for-book');
const voteForBook = require('./vote-for-book');
const createBook = require('./create-book');

router.get('/', [books, booksStartWith, orderBooks, booksStartIndex, booksMaxResults]);
router.get('/search', [books, searchWithFilters, searchWithKeyWords, orderBooks, booksStartIndex, booksMaxResults]);
router.post('/book', createBook);
router.get('/:id', bookWithId);
router.put('/:id', updateBook);
router.get('/:id/voted-users', usersVotedForBook);
router.post('/:id/vote', voteForBook);


module.exports = router;
