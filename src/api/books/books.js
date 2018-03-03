const data = require('../../../data');

module.exports = (req, res, next) => {
    req.books = data.books;
    next();
};
