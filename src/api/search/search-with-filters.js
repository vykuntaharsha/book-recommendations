const data = require('../../../data');

module.exports = (req, res, next) =>{

    const filters = req.query.q;

    if(!filters){
        next();
    }

    const isbn =  filters.isbn || null;
    const titles = filters.title ? filters.title.split(' ') : null;
    const authors = filters.author ? filters.author.split(' ') : null;
    const genres = filters.genre ? filters.genre.split(' ') : null;

    if(!req.books){
        req.books = data.books;
    }

    if( isbn ){
        req.books = req.books.filter( book => book.isbn === isbn.trim() );
    }

    if( titles ){
        const regex = new RegExp( titles.join('|') , 'i');
        req.books = req.books.filter( book => book.title.match(regex) );
    }

    if( authors ){
        const regex = new RegExp( authors.join('|') , 'i');
        req.books = req.books.filter( book => book.author.match(regex) );
    }

    if( genres ){
        const regex = new RegExp( genres.join('|') , 'i');
        req.books = req.books.filter( book => book.genre.name.match(regex) );
    }

    next();
};
