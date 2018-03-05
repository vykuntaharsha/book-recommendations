const books = [];

const getUrl = () => {
    return '../../api/books';
};

const callGetJsonService = (url) => {
    return fetch(url)
    .then(r => {
        return r.json();
    });
};

const performGetRequest = () => {
    const url = getUrl();
    callGetJsonService(url)
    .then(json => {
        renderBooklist(json);
    });
};

function processJson(json) {
    for (let i = 0; i < json.books.length; i++) {
        let book = {};
        book.isbn = json.books[i].isbn;
        book.image = json.books[i].image;
        book.title = json.books[i].title;
        book.author = json.books[i].author;
        book.genre = json.books[i].genre;
        book.votes = json.books[i].votes;
        book.description = json.books[i].description;
        books.push(book);
    }
}

function renderBooklist(json) {
    for (let i = 0; i < 8; i++) {
        renderSingleBook(i, json);
    }
}

function renderSingleBook(id, json) {
    document.querySelector('.book-img-' + id).src = json.books[id].image;
    document.querySelector('.book-title-' + id).innerHTML = json.books[id].title;
    json.books[id].author === '' ? document.querySelector('.book-author-' + id).innerHTML = 'unknown' : document.querySelector('.book-author-' + id).innerHTML = json.books[id].author;
    document.querySelector('.book-vote-' + id).innerHTML = json.books[id].votes;
}

performGetRequest();