

module.exports = (req, res, next) => {

    const startsWith = req.query.startsWith;

    if( startsWith ){

        if( startsWith.author && startsWith.author.match(/^[a-z]{1}$/i) ){
            req.books = req.books.filter( book => book.author.toUpperCase().startsWith( startsWith.author.toUpperCase() ));
        }

        if( startsWith.title && startsWith.title.match(/^[a-z]{1}$/i) ){
            req.books = req.books.filter( book => book.title.toUpperCase().startsWith( startsWith.title.toUpperCase() ));
        }

    }
    next();
};
