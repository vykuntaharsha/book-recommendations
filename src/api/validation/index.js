const data = require('../../../data');


function isValidBook(book) {
    const bookToUpdate = data.books.find( b => b.isbn === book.isbn);
    if(!bookToUpdate){
        return false;
    }
    if(bookToUpdate.image != book.image || bookToUpdate.votes != book.votes){
        return false;
    }
    if(isValidGenre(book.genre)){
        return true;
    }
    return false;
}

function isValidGenre( genre ) {
    const index = data.genres.findIndex( g => g.id === genre.id);
    if( index >= 0 && data.genres[index].name === genre.name ){
        return true;
    }
    return false;
}

module.exports = {
    isValidBook,
    isValidGenre
};
