const data = require('../../../data');
const isValidBook = require('../validation').isValidBook;

module.exports = (req, res) =>{
    const requestedBook = req.body.book || null;
    const id = req.params.id;

    if( !requestedBook ){
        res.sendStatus(400);
        return ;
    }
    const index = data.books.findIndex( book => book.isbn === id );

    if(index >= 0 && isValidBook(requestedBook)){
        const book = data.books[index];
        book.title = requestedBook.title;
        book.author = requestedBook.author;
        book.genre = requestedBook.genre;
        book.description = requestedBook.description;
        res.sendStatus(204);
    }else if(index >=0 && !isValidBook(requestedBook)) {
        res.sendStatus(406);
    }else {
        res.sendStatus(400);
    }
};
