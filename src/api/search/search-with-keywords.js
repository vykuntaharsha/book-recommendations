const data = require('../../../data');


module.exports = (req, res, next) =>{

    if(!req.query.q){
        next();
    }

    const keyWords =  req.query.q.keywords ? req.query.q.keywords.split(' ') : null;

    if(!req.books){
        req.books = data.books;
    }

    if( keyWords ){
        const regex = new RegExp(keyWords.join('|'));

        req.books = req.books.filter( book => {
            if( book.title.match(regex) ||
                book.author.match(regex) ||
                book.genre.name.match(regex) ||
                book.description.match(regex)){
                    return book;
                }
        });
    }

    next();
};
