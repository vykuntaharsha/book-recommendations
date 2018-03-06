const data = require('../../../data');
const isValidBook = require('../validation').isValidBook;

module.exports = (req, res) =>{
    const requestedBook = req.body.book;
    const id = req.params.id;

    const index = data.books.findIndex( book => book.isbn === id );

    if(index >= 0 && isValidBook(requestedBook)){
        data.books[index] = requestedBook;
        res.sendStatus(204);
    }else if(index >=0 && !isValidBook(requestedBook)) {
        res.sendStatus(406);
    }else {
        res.sendStatus(400);
    }
};
