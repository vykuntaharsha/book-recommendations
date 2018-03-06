let bookJson = {};

const getUrl = () => {                      // Providing url for fetching. Using this function to fetch data from server
    return '../../api/books?maxResults=40';
};

const callGetJsonService = (url) => {       
    return fetch(url)
    .then(r => {
        return r.json();
    });
};

const performGetRequest = () => {           // Using with the function before this. Transferring fetched data to local variable. And establishing init render funciton 
    const url = getUrl();
    callGetJsonService(url)
    .then(json => {
        //processJson(json);
        bookJson = json;
        renderbookList();
    });
};

/*
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
*/

function renderbookList() {                 // Render function for the book list. Modifying this function after sort function is finished
    for (let i = 0; i < 8; i++) {
        renderSingleBook(i);
    }
}

function renderSingleBook(id) {             // Rending single book. No more need modifying.
    document.querySelector('.book-img-' + id).src = bookJson.books[id].image;
    document.querySelector('.book-title-' + id).innerHTML = bookJson.books[id].title;
    bookJson.books[id].author === '' ? document.querySelector('.book-author-' + id).innerHTML = 'unknown' : document.querySelector('.book-author-' + id).innerHTML = bookJson.books[id].author;
    document.querySelector('.book-vote-' + id).innerHTML = bookJson.books[id].votes;
}

function addListenersToComponents() {       // Add listeners to components. Modifying for more interreacting function.
    let allImage = document.querySelectorAll('.book-img');
    for (let singleImage of allImage) {
        singleImage.addEventListener('click', bookImageButton);
    }
    let allVote = document.querySelectorAll('.button-like');
    for (let singleVote of allVote) {
        singleVote.addEventListener('click', voteButton);
    }
}

function voteButton(event) {                // Just for Vote. No need more modifying
    let posVote = event.target.parentElement.parentElement.id.substr(5);
    if (event.target.innerHTML === 'vote') {
        bookJson.books[posVote].votes += 1;
        document.querySelector('.book-vote-' + posVote).innerHTML = bookJson.books[posVote].votes;
        event.target.innerHTML = 'cancel';
    } else {
        bookJson.books[posVote].votes -= 1;
        document.querySelector('.book-vote-' + posVote).innerHTML = bookJson.books[posVote].votes;
        event.target.innerHTML = 'vote';
    }
}

function bookImageButton(event) {           // Just for Vote. Modifying after page number funtion is finished
    let posImage = event.target.classList[1].substr(9);
    let book = bookJson.books[posImage];
    renderBookDetail(book);
}

function renderBookDetail(book) {           // No need more modifying
    document.querySelector('.book-title-details').innerHTML = book.title;
    document.querySelector('.book-image-details').src = book.image;
    document.querySelector('.book-isbn-details').innerHTML = book.isbn;
    document.querySelector('.book-author-details').innerHTML = book.author;
    document.querySelector('.book-genre-details').innerHTML = book.genre;
    document.querySelector('.book-votes-details').innerHTML = book.votes;
    document.querySelector('.book-description-details').innerHTML = book.description;
}

performGetRequest();
addListenersToComponents();