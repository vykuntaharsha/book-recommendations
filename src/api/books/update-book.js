const data = require('../../../data');
const isValidBook = require('../validation').isValidBook;
const isValidUser = require('../validation').isValidUser;

function userExists( book, user ) {
    const foundUser = book.createdUsers.find( u => u.id === user.id);
    if(foundUser) return true;
    return false;
}
module.exports = (req, res) =>{
    const requestedBook = req.body.book || null;
    const id = req.params.id;
    const user = req.body.user || null;

    if( !requestedBook ){
        res.sendStatus(400);
        return ;
    }
    const index = data.books.findIndex( book => book.isbn === id );

    if(index >= 0 && isValidBook(requestedBook) && isValidUser(user)){
        const book = data.books[index];
        book.title = requestedBook.title;
        book.author = requestedBook.author;
        book.genre = requestedBook.genre;
        book.description = requestedBook.description;
        if( !userExists(book, user) ) book.createdUsers.push(user);
        res.sendStatus(204);
    }else if(index >=0 && !isValidBook(requestedBook)) {
        res.sendStatus(406);
    }else {
        res.sendStatus(400);
    }
};
