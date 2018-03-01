const router = require('express').Router();
const genresInRange = require('./genres-in-range');
const genreWithId = require('./genre-with-id');
const booksWithGenre = require('./books-with-genre');

router.get('/', genresInRange);
router.get('/:id', genreWithId);
router.get('/:id/books', booksWithGenre);

module.exports = router;
