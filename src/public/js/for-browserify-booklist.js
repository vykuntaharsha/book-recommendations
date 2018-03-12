let bookJson = {};
let bookListUrl = null;
let maxPages = 1;
const noOfBooksPerPage = 8;
const pages = document.querySelector('.pages');
const booklist = document.querySelector('.books');

const getUrl = () => {                      // Providing url for fetching. Using this function to fetch data from server
    return 'api/books?maxResults=40';
};

const callGetJsonService = (url) => {
    return fetch(url)
    .then(r => {
        return r.json();
    });
};

const performGetRequest = ( urlInput, page ) => {           // Using with the function before this. Transferring fetched data to local variable. And establishing init render funciton
    const url = urlInput || getUrl();

    bookListUrl = url;
    callGetJsonService(url)
    .then(json => {
        //processJson(json);
        maxPages = Math.ceil(json.maxAvailableBooks / noOfBooksPerPage);
        bookJson = json;
        renderPage( page );
    });
};

function renderPageButtons( page ) {
    if( !page ) page = 1;
    if( page < 1) page = 1;
    if( page > maxPages) page = maxPages;

    const rangeStart = (page-1 > 3) ? page-2 : 2;
    const rangeEnd = (maxPages-page > 3) ? page+2 : maxPages-1;

    pages.innerHTML = '<li class="previous-page"><a href="#booklist"> << </li>\n';
    pages.innerHTML += '<li class="page" pageNo="1"><a href="#booklist"> 1</a></li>\n';
    if( rangeStart != 2) pages.innerHTML += '...\n';

    for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.innerHTML += `<li class="page" pageNo="${i}"><a href="#booklist"> ${i}</a></li>\n`;
    }

    if( rangeEnd != maxPages-1 ) pages.innerHTML += '...\n';
    pages.innerHTML += `<li class="page" pageNo="${maxPages}"><a href="#booklist"> ${maxPages}</a></li>\n`;
    pages.innerHTML += '<li class="next-page"><a href="#booklist"> >> </li>\n';

    let activePage = null;
    const pageButtons = document.querySelectorAll('.page');
    pageButtons.forEach( p => {
        if(p.getAttribute('pageNo') == page) activePage = p;
    });

    activePage.classList.add('active');
    addListenersToPageButtons();
}

function addListenersToPageButtons() {
    const previousButton = document.querySelector('.previous-page');
    const pageButtons = document.querySelectorAll('.page');
    const nextButton = document.querySelector('.next-page');

    const currentPageNo = parseInt( document.querySelector('.page.active').getAttribute('pageNo') );

    if(currentPageNo === 1){
        previousButton.classList.add('disabled');
        nextButton.classList.remove('disabled');
    }
    else if(currentPageNo === maxPages){
        previousButton.classList.remove('disabled');
        nextButton.classList.add('disabled');
    }else {
        previousButton.classList.remove('disabled');
        nextButton.classList.remove('disabled');
    }

    previousButton.addEventListener('click', ()=>{
        if(currentPageNo != 1) renderPage( currentPageNo - 1);
    });

    nextButton.addEventListener('click', ()=>{
        if(currentPageNo != maxPages) renderPage( currentPageNo + 1);
    });

    pageButtons.forEach( button => {
        const pageNo = parseInt(button.getAttribute('pageNo'));
        button.addEventListener('click', ()=>{
            renderPage( pageNo );
        });
    });
}

function loadPageData( url , page) {
    callGetJsonService( url )
    .then(json => {
        bookJson = json;
        renderPageButtons( page );
        renderbookList();
    });
}

function renderPage( page ) {
    if( !page ) page = 1;
    if( page < 1) page = 1;
    if( page > maxPages) page = maxPages;

    currentPage = page;
    const startIndex = (page - 1) * noOfBooksPerPage;

    const origin = new URL(document.location).origin;
    const url = new URL(bookListUrl, origin);

    url.searchParams.set('startIndex', startIndex);
    url.searchParams.set('maxResults', noOfBooksPerPage);

    loadPageData( url, page );
}

function renderbookList() {                 // Render function for the book list. Modifying this function after sort function is finished
    booklist.innerHTML = '';
    for (let i = 0; i < noOfBooksPerPage; i++) {
        booklist.innerHTML += renderSingleBook(i);

    }

    addListenersToComponents();
}

function renderSingleBook(id) {             // Rending single book. No more need modifying.
    if( !bookJson.books[id] ) return '';

    const book = bookJson.books[id];
    const bookHtml = getBookHtml(book, id);
    const listItem = `<li id="book-${id}" class="book" data-id="${book.isbn}">${bookHtml}</li>`
    return listItem;
}

function getBookHtml( book, id ) {
    const title = book.title.length < 50 ? book.title : book.title.substr(0,47).trim()+'...';
    const author = book.author ? book.author : "unknown";
    const button = setVoteButton(book);

    const bookHtml = `<a href="#book-details"><img class="book-img book-img-${id}" src="${book.image}"></a>
    <p class="book-title book-title-${id}">${title}</p>
    <p class="book-author book-author-${id}">${author}</p>
    <div class="like">
        <button class="button-like">${button}</button><p class="book-vote book-vote-${id}">${book.votes}</p>
    </div>`

    return bookHtml;
}
function setVoteButton(book) {
    const user = require('./for-browserify-index');
    const foundUser = book.votedUsers.find( u => u.id === user.id );
    if( foundUser ){
        return 'cancel';
    }
    return 'vote';
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
    const book = bookJson.books[posVote];
    const postVoteDataToServer = require('./for-browserify-book-details').postVoteDataToServer;
    const user = require('./for-browserify-index');
    postVoteDataToServer(`api/books/${book.isbn}/vote`, { user : user });

    const bookDetails = document.querySelector('.book-details').getAttribute('data-id')
    if( bookDetails === book.isbn ) renderDetails( book );
}

function bookImageButton(event) {           // Just for Vote. Modifying after page number funtion is finished

    let posImage = event.target.classList[1].substr(9);
    let book = bookJson.books[posImage];

    renderDetails( book );
}

function renderDetails( book ) {
    const renderBookDetails = require('./for-browserify-book-details').renderBookDetails;
    renderBookDetails(`api/books/${book.isbn}`);
}

const orderOptions = document.querySelector('.order-select');

orderOptions.addEventListener('change', () => {
    const origin = new URL(document.location).origin;
    const url = new URL(bookListUrl, origin);


    if(orderOptions.value == 1){
        url.searchParams.set( 'orderBy', 'title' );
        performGetRequest(url);
    }else {
        url.searchParams.set('orderBy', '-votes' )
        performGetRequest(url);
    }
});

function updateBookView( bookToUpdate ) {
    const id = bookJson.books.findIndex( book => book.isbn === bookToUpdate.isbn );

    const fetchBookDetails = require('./for-browserify-book-details').getBookDetailsFromServer;
    if( id >= 0){

        fetchBookDetails( `api/books/${bookToUpdate.isbn}`)
        .then( book => {
            bookJson.books[id] = book;
            const targetBook = document.querySelector(`#book-${id}`);

            targetBook.innerHTML = getBookHtml( bookJson.books[id], id );
            const button = document.querySelector(`#book-${id} .button-like`);
            button.addEventListener('click', voteButton);

            const img = document.querySelector(`#book-${id} .book-img`);
            img.addEventListener('click', bookImageButton);
        });

    }

}
performGetRequest();


module.exports = {
    performGetRequest,
    updateBookView
};
