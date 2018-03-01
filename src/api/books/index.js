const router = require('express').Router();
const booksInRange = require('./books-in-range');
const bookWithId = require('./book-with-id');


router.get('/', booksInRange);
router.get('/:id', bookWithId);

module.exports = router;
