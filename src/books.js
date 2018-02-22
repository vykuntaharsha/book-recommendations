const fileService = require('fs');
const genres = require('./genres-data');

const booksRawData = fileService.readFileSync('data/books-data.csv','utf8');

const books = [];

booksRawData.split(/\n/).map(line => {
    const words = line.substring(1,line.length-2).split(/","/);
    const book = {};

    book.isbn = words[0];
    book.image = words[2];
    book.title = words[3];
    book.author = words[4];
    book.category = findGenre((words[5],10));
    book.upvotes = 0;
    books.push(book);
});

function findGenre(id){
    for (genre of genres) {
        if(genre.id === parseInt(id)){
            return genre;
        }
    }
}

module.exports = books;
