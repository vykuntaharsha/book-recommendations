let bookJson = {};
let bookListUrl = null;
let maxPages = 1;
const noOfBooksPerPage = 8;
const pages = document.querySelector('.pages');

const getUrl = () => {                      // Providing url for fetching. Using this function to fetch data from server
    return 'api/books?maxResults=40';
};

const callGetJsonService = (url) => {
    return fetch(url)
    .then(r => {
        return r.json();
    });
};

const performGetRequest = ( urlInput ) => {           // Using with the function before this. Transferring fetched data to local variable. And establishing init render funciton
    const url = urlInput || getUrl();

    bookListUrl = url;
    callGetJsonService(url)
    .then(json => {
        //processJson(json);
        maxPages = Math.ceil(json.maxAvailableBooks / noOfBooksPerPage);
        bookJson = json;
        renderPage();
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

    const startIndex = (page - 1) * noOfBooksPerPage;

    const origin = new URL(document.location).origin;
    const url = new URL(bookListUrl, origin);

    url.searchParams.set('startIndex', startIndex);
    url.searchParams.set('maxResults', noOfBooksPerPage);

    loadPageData( url, page );
}

function renderbookList() {                 // Render function for the book list. Modifying this function after sort function is finished
    for (let i = 0; i < 8; i++) {
        renderSingleBook(i);
    }
}

function renderSingleBook(id) {             // Rending single book. No more need modifying.
    if( !bookJson.books[id] ) return;
    document.querySelector('.book-img-' + id).src = bookJson.books[id].image;
    document.querySelector('.book-title-' + id).innerHTML = bookJson.books[id].title.length < 50 ? bookJson.books[id].title : bookJson.books[id].title.substr(0,47).trim()+'...';
    bookJson.books[id].author === '' ? document.querySelector('.book-author-' + id).innerHTML = 'unknown' : document.querySelector('.book-author-' + id).innerHTML = bookJson.books[id].author;
    document.querySelector('.book-vote-' + id).innerHTML = bookJson.books[id].votes;
    const voteButton = document.querySelector('#book-'+id + ' button');
    setVoteButton( bookJson.books[id] , voteButton );
}

function setVoteButton(book, button ) {
    const foundUser = book.votedUsers.find( u => u.id === user.id );
    if( foundUser ){
        button.innerHTML = 'cancel';
    }else {
        button.innerHTML = 'vote';
    }
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
    postVoteDataToServer(`api/books/${book.isbn}/vote`, { user : user });
}

function bookImageButton(event) {           // Just for Vote. Modifying after page number funtion is finished
    let posImage = event.target.classList[1].substr(9);
    let book = bookJson.books[posImage];
    renderBookDetails(`api/books/${book.isbn}`);
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

performGetRequest();
addListenersToComponents();
