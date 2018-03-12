const constants = require('../constants');

module.exports = (req, res) => {

    const maxResults = parseInt(req.query.maxResults) || constants.DEFAULT_MAX_RESULTS;

    const maxAvailableBooks = req.books.length;
    req.books = req.books.slice(0, maxResults);

    if( req.books ){
        res.status(200).json({
            noOfBooks : req.books.length,
            maxAvailableBooks : maxAvailableBooks,
            books : req.books
        });
    }else {
        res.sendStatus(400);
    }

};
