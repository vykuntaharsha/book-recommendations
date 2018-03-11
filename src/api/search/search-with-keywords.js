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
        const regex = new RegExp(keyWords.join('|'),'ig');

        const noOfMatches = (book)=>{
            let noOfMatches = 0;

            noOfMatches += book.title.match(regex) ? book.title.match(regex).length : 0;

            noOfMatches += book.author.match(regex) ? book.author.match(regex).length : 0;

            noOfMatches += book.genre.name.match(regex) ? book.genre.name.match(regex).length : 0;

            noOfMatches += book.isbn.match(regex) ?
            book.isbn.match(regex).length : 0;
            return  noOfMatches;
        };

        req.books = req.books.filter( book => {
            if( book.title.match(regex) ||
                book.author.match(regex) ||
                book.genre.name.match(regex) ||
                book.isbn.match(regex)){
                    return book;
                }
        });

        req.books.sort( (book1, book2) => noOfMatches(book2) - noOfMatches(book1) );
    }


    next();
};
