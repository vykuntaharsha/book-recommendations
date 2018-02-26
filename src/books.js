const fileService = require('fs');
const genres = require('./genres');

const booksRawData = fileService.readFileSync('data/books-data.csv','utf8');

const books = [];

booksRawData.split(/\n/).map(line => {
    const words = line.substring(1,line.length-2).split(/","/);
    const book = {};

    book.isbn = words[0];
    book.image = words[2];
    book.title = words[3];
    book.author = words[4];
    book.genre = findGenre((words[5],10));
    book.votes = 0;
    book.description = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
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
