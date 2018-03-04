const data = require('../../../data');

module.exports = (req, res) =>{

    const requestedBook = req.body.book;
    const index = data.books.findIndex( book => book.isbn === req.params.id);

    if(index >= 0 && requestedBook.isbn === data.books[index].isbn){
        if( Math.abs(requestedBook.votes - data.books[index].votes) <= 1  ){
            data.books[index].votes = requestedBook.votes;
            res.sendStatus(204);
        }else {
            res.sendStatus(406);
        }
    }else {
        res.sendStatus(400);
    }
};
