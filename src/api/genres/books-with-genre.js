const data = require('../../../data');

module.exports = (req, res, next) => {

    const id = req.params.id;

    req.books = data.books.filter( book => {
        if(book.genre){
            if(book.genre.id === id ){
                return book;
            }
        }
    });

    next();
};
