const user = require('./for-browserify-index');

const book = {};
const postDataToServer = require('./for-browserify-book-details').postDataToServer;


function createBook() {
    book.title = document.querySelector('.book-title-input').value;
    book.author = document.querySelector('.book-author-input').value;
    book.image = document.querySelector('.book-image-input').value;
    book.description = document.querySelector('.book-image-input').value;
    const genreElement = document.querySelector('.book-genre-input');

    const genreOption = genreElement.options[genreElement.selectedIndex];
    book.genre ={};
    book.genre.id = genreOption.getAttribute('data-id');
    book.genre.name = genreOption.getAttribute('data-name');

    postDataToServer('api/books/book', {user : user, book : book })
    .then( res => {
        const statusSpan = document.querySelector('.create-book-status');
        statusSpan.classList.remove('hide');
        if(res.status === 204){
            statusSpan.innerHTML = "successfully created";
            renderCreateBook();
        }else {
            statusSpan.innerHTML = "provide valid data";
        }
        setTimeout(()=>{
            statusSpan.classList.add('hide');
        }, 2000);
    });

}

function renderCreateBook() {
    document.querySelector('.book-title-input').value = '';
    document.querySelector('.book-author-input').value = '';
    document.querySelector('.book-image-input').value = '';
    document.querySelector('.book-image-input').value = '';
    const populateGenres = require('./for-browserify-book-details').populateGenres;

    populateGenres('.book-genre-input');
}

renderCreateBook();
const createButton = document.querySelector('.book-create-button');
createButton.addEventListener('click', createBook);

const closeButton = document.querySelector('.create-book-close');
closeButton.addEventListener('click', ()=>{
    document.getElementById('create-book').classList.add('hide');
});

const createBookNav = document.getElementById('nav-create');
createBookNav.addEventListener('click', ()=>{
    document.querySelector('#create-book').classList.remove('hide');
    renderCreateBook();
});

module.exports = renderCreateBook;
