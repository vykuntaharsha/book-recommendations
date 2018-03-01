const books = require('../../../data').books;
const constants = require('../constants');

module.exports = (req, res) => {
    //parsing url
    const maxResults = parseInt(req.query.maxResults) || constants.DEFAULT_MAX_RESULTS;

    const startIndex = parseInt(req.query.startIndex) || constants.DEFAULT_START_INDEX;

    let all = false;

    if(req.query.all === 'true'){
        all = true;
    }

    // getting requested books
    let booksRequested;

    if( all ){
        booksRequested = books.slice( startIndex );
    }else {
        booksRequested = books.slice( startIndex , startIndex + maxResults);
    }

    //sending response
    if(booksRequested){
        res.status(200).json({
            noOfBooks : booksRequested.length,
            books : booksRequested
        });
    }else {
        res.status(404).send(constants.PAGE_NOT_FOUND);
    }

};
