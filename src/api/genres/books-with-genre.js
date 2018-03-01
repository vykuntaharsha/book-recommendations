const books = require('../../../data').books;
const constants = require('../constants');

module.exports = (req, res) => {
    //parsing url
    const id = req.params.id;
    const maxResults = parseInt(req.query.maxResults) || constants.DEFAULT_MAX_RESULTS;

    const startIndex = parseInt(req.query.startIndex) || constants.DEFAULT_START_INDEX;

    let all = false;

    if(req.query.all === 'true'){
        all = true;
    }

    //fitering books of requested genre
    const booksWithRequestedGenre = books.filter( book => {
        if(book.genre){
            if(book.genre.id === id ){
                return book;
            }
        }
    });

    let booksRequested;

    if( all ){
        booksRequested = booksWithRequestedGenre.slice( startIndex );
    }else {
        booksRequested = booksWithRequestedGenre.slice( startIndex, startIndex + maxResults );
    }

    //sending response
    if(booksRequested){
        res.status(200).json({
            noOfBooks : booksRequested.length,
            books : booksRequested
        });
    }else {
        res.status(400).send(constants.PAGE_NOT_FOUND);
    }
};
