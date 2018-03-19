(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
const user = require('./for-browserify-index');
const book = {}
let url = null;

function addListenersToComponents() {
    //adding listeners to the components
    document.querySelector('.vote-button').addEventListener('click', voteToggle);
    document.querySelector('.edit-button').addEventListener('click', renderToEdit);
    document.querySelector('.reset-button').addEventListener('click', renderToEdit);
    document.querySelector('.save-button').addEventListener('click', saveBookDetails);
}

function voteToggle(event) {
    //toggling the vote and voted buttons
    if(event.target.classList.contains('voted')){
        event.target.classList.remove('voted');
        document.querySelector('.vote-button').src = 'images/vote.svg';
    }else {
        event.target.classList.add('voted');
        document.querySelector('.vote-button').src = 'images/voted.svg';
    }
    postDataToServer( `api/books/${book.isbn}/vote`, { user : user});
    renderBookDescription();
}

function renderToEdit() {
    // rendering the section to enable editing
    document.querySelector('.edit-button').classList.add('hide');
    document.querySelector('.reset-button').classList.remove('hide');
    document.querySelector('.save-button').classList.remove('hide');

    document.querySelector('.book-title-details').outerHTML = `<input class="book-title-details title" type="text" value="${book.title}">`;

    document.querySelector('.book-author-details').outerHTML = `<input class="book-author-details title" type="text" value="${book.author}">`;

    document.querySelector('.book-genre-details').outerHTML = `<select class="book-genre-details title"> <select>`;
    populateGenres('.book-genre-details', true);

    document.querySelector('.book-description-details').outerHTML = `<div class="book-description-details title edit-description" contenteditable="true">${book.description}</div>`;
}

function populateGenres( selector, setOptionFlag ) {
    fetch('api/genres?all=true')
    .then(res => res.json())
    .then(data => data.genres)
    .then( genres => {

        const options = genres.map( genre => {
            if(setOptionFlag && genre.id === book.genre.id){
                return `<option data-id="${genre.id}" data-name="${genre.name}" selected>${genre.name}</option>`
            }else {
                return `<option data-id="${genre.id}" data-name="${genre.name}">${genre.name}</option>`
            }
        }).join('\n');

        document.querySelector(selector).innerHTML = options;
    })
    .catch(error => console.log('error while populating genres' + error));
}

function saveBookDetails() {
    // saving the book details
    book.title = document.querySelector('.book-title-details').value;
    book.author = document.querySelector('.book-author-details').value;
    const genreElement = document.querySelector('.book-genre-details');

    const genreOption = genreElement.options[genreElement.selectedIndex];

    book.genre.id = genreOption.getAttribute('data-id');
    book.genre.name = genreOption.getAttribute('data-name');
    book.description = document.querySelector('.book-description-details').innerHTML;
    putBookDetailsToSever( `api/books/${book.isbn}`, {book : book, user : user})
    .then( res => res.status)
    .then( status => {
        if( status === 204 ){
            renderSavedBookData();
            renderBookDescription();
        }
    })
    .catch(error => console.log('error while saving the book' + error));

}

function putBookDetailsToSever( url, data) {
    return fetch(url , {
        body: JSON.stringify(data),
        method: 'PUT',
        mode: 'cors',
        headers: {
            'content-type': 'application/json'
        },
    });
}

function renderSavedBookData() {
    //rendering the saved book details
    document.querySelector('.edit-button').classList.remove('hide');
    document.querySelector('.reset-button').classList.add('hide');
    document.querySelector('.save-button').classList.add('hide');

    document.querySelector('.book-title-details').outerHTML = `<h1 class="book-title-details title"></h1> `;

    document.querySelector('.book-author-details').outerHTML = `<h4 class="book-author-details title"></h4>`;

    document.querySelector('.book-genre-details').outerHTML = `<h5 class="book-genre-details title"></h5>`;

    document.querySelector('.book-description-details').outerHTML = `<p class="book-description-details title"</p>`;

}

function renderBookDescription() {
    document.querySelector('.book-details').classList.remove('hide');
    getBookDetailsFromServer(url)
    .then(bookFetched => {
        book.title = bookFetched.title;
        book.image = bookFetched.image;
        book.isbn = bookFetched.isbn;
        book.author = bookFetched.author;
        book.genre = bookFetched.genre;
        book.votes = bookFetched.votes;
        book.description = bookFetched.description;
        book.votedUsers = bookFetched.votedUsers;
        book.createdUsers = bookFetched.createdUsers;
    })
    .then( () => {
        setBookDetails();
        updateListView();
        return book.votedUsers;
    })
    .then( users => {
        const voteButton = document.querySelector('.vote-button');
        if(users.find( u => u.id === user.id )){
            voteButton.classList.add('voted');
            voteButton.src = 'images/voted.svg'
        }else {
            voteButton.classList.remove('voted');
            voteButton.src = 'images/vote.svg'
        }
        setVotedUsers(users);
    })
    .catch(error => console.log('error in book-data parsing' + error));

}

function setVotedUsers( users ) {
    const list = users.map( user => `<li>${user.id}</li>`).join(',');
    document.querySelector('.voted-users').innerHTML = list;
}

function setBookDetails() {
    document.querySelector('.book-details').setAttribute('data-id', book.isbn);
    document.querySelector('.book-title-details').innerHTML = book.title;
    document.querySelector('.book-image-details').src = book.image;
    document.querySelector('.book-isbn-details').innerHTML = book.isbn;
    document.querySelector('.book-author-details').innerHTML = book.author;
    document.querySelector('.book-genre-details').innerHTML = book.genre.name;
    document.querySelector('.book-votes-details').innerHTML = book.votes;
    document.querySelector('.book-description-details').innerHTML = book.description;

    document.querySelector('.created-users').innerHTML = 'Created users:' + setCreatedUsers(book.createdUsers);
}

function setCreatedUsers( users ) {
    const list = users.map( user => user.id ).join(',');
    return list;
}

function getBookDetailsFromServer( url ) {
    return fetch(url)
        .then(res => res.json())
        .then(data => data.book );
}

function updateListView() {
    const updateBook = require('./for-browserify-booklist').updateBookView;
    const booklist = document.querySelectorAll('.book');

    booklist.forEach( item => {
        const itemId = item.getAttribute('data-id');
        if(itemId === book.isbn) updateBook( book );
    });
}

const renderBookDetails = (bookUrl) => {
    url = bookUrl;
    renderBookDescription();
}

function postDataToServer(url, data) {
    return fetch(url , {
        body: JSON.stringify(data),
        method: 'POST',
        mode: 'cors',
        headers: {
            'content-type': 'application/json'
        },
    });
}

addListenersToComponents();

module.exports = {
    renderBookDetails,
    postDataToServer,
    getBookDetailsFromServer,
    populateGenres
};

},{"./for-browserify-booklist":2,"./for-browserify-index":4}],2:[function(require,module,exports){
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
    const postVoteDataToServer = require('./for-browserify-book-details').postDataToServer;
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
const orderButton = document.querySelector('.order-button');

orderButton.addEventListener('click', orderBooks);
orderOptions.addEventListener('change', orderBooks);

function orderBooks() {
    const origin = new URL(document.location).origin;
    const url = new URL(bookListUrl, origin);


    if(orderOptions.value == 1){
        url.searchParams.set( 'orderBy', 'title' );
        performGetRequest(url);
    }else {
        url.searchParams.set('orderBy', '-votes' )
        performGetRequest(url);
    }
}

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

},{"./for-browserify-book-details":1,"./for-browserify-index":4}],3:[function(require,module,exports){
const user = require('./for-browserify-index');

const book = {};
const postDataToServer = require('./for-browserify-book-details').postDataToServer;


function createBook() {
    book.title = document.querySelector('.book-title-input').value;
    book.author = document.querySelector('.book-author-input').value;
    book.image = document.querySelector('.book-image-input').value;
    book.description = document.querySelector('.book-description-input').value;
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
    document.querySelector('.book-description-input').value = '';
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

},{"./for-browserify-book-details":1,"./for-browserify-index":4}],4:[function(require,module,exports){
    const performGetRequest = require('./for-browserify-booklist').performGetRequest;
let slideIndex=0;
showSlides();
addListenersToSearchBar();
const user = {};

getUser();
function getUser() {
    fetch('users',{
        method : 'POST'
    })
    .then(res => res.json())
    .then(data => data.user)
    .then(fetchedUser => {
        console.log();
        user.id = fetchedUser.id;
        notifyUser();
    })
    .catch(error => console.log('error while fetching user: ' + error));

}

function notifyUser() {
    const welcomeNote = document.querySelector('.user-welcome');
    welcomeNote.innerHTML = `welcome user ${user.id}`;
    setTimeout(()=>{
        welcomeNote.parentNode.removeChild(welcomeNote);
    }, 2000);

}

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("slides");
    let dots = document.getElementsByClassName("dot");
    for (i = 0; i < slides.length; i++) {
       slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 2000);
}

function addListenersToSearchBar() {

    document.querySelector('.search-input').addEventListener( 'keypress', checkKeyAndPerformSearch);
    document.querySelector('.search-form >button').addEventListener('click', searchByKeywords);
}

function checkKeyAndPerformSearch( event ) {
    if(event.keyCode === 13 ){
        searchByKeywords();
    }
}

function searchByKeywords(){
    let keywords = document.querySelector('.search-input').value;
    document.getElementById('booklist').scrollIntoView();

    if(keywords){
        keywords = keywords.replace(/\s/g, '+');
        performGetRequest(`api/books/search?q[keywords]=${keywords}`);
    }
}

module.exports = user;

},{"./for-browserify-booklist":2}],5:[function(require,module,exports){
const performGetRequest = require('./for-browserify-booklist').performGetRequest;
const nav = () => {

    const sideMenu = document.querySelector('.side-menu');
    const searchBar = document.querySelector('#corner-search');
    const searchIcon = document.querySelector('#search-icon');
    const genreNav = document.querySelector('#nav-genre');
    const authorNav = document.querySelector('#nav-author');
    const titleNav = document.querySelector('#nav-title');
    const popularNav = document.querySelector('#nav-popular');

    searchIcon.addEventListener('click', () =>{
        if( window.getComputedStyle( searchBar, 'style').display==='none'){
            searchBar.setAttribute('style', 'display:inline');
        }else {
            performSearch();
            searchBar.setAttribute('style', 'display:none');
        }
    });

    searchBar.addEventListener('keypress', (event)=>{
        if(event.key === 'Enter'){
            performSearch();
        }
    });

    genreNav.addEventListener('click', ()=>{
        sideMenu.innerHTML = '';
        fetchAllGenres()
        .then(genres => setSideMenuGenres( genres, fetchBooksOf ));
    });

    authorNav.addEventListener('click', ()=>{
        sideMenu.innerHTML = '';
        setSideMenu('author');
    });

    titleNav.addEventListener('click', ()=>{
        sideMenu.innerHTML = '';
        setSideMenu('title');
    });

    popularNav.addEventListener('click', ()=>{
        performGetRequest('api/books?orderBy=-votes');
        sideMenu.innerHTML = '';
        fetchAllGenres()
        .then( genres => {
            setSideMenuGenres( genres, fetchPopularBooksOf )
        });
    });

    function performSearch() {
        let keywords = searchBar.value;
        document.getElementById('booklist').scrollIntoView();

        if(keywords){
            keywords = keywords.replace(/\s/g, '+');
            performGetRequest(`api/books/search?q[keywords]=${keywords}`);
        }
    }

    function addListenersToMenuList() {
        const menulist = document.querySelectorAll(".menu-item");
        const submenulist = document.querySelectorAll(".sub-side-menu");

        for (let i = 0; i < menulist.length; i++) {
            menulist[i].addEventListener("click", function () {
                if (window.getComputedStyle(submenulist[i], 'style').display==='none') {
                    submenulist[i].setAttribute('style', 'display:block');
                } else {
                    submenulist[i].setAttribute('style', 'display:none');
                }
            });
        }


    }

    function addListenersToSubMenuBooks( parentListUrl ) {
        const subMenuBookList = document.querySelectorAll(".sub-side-menu >li");

        const renderBookDetails = require('./for-browserify-book-details').renderBookDetails;
        subMenuBookList.forEach( li => {
            li.addEventListener('click', () =>{
                const bookId = li.getAttribute('data-id');
                renderBookDetails(`api/books/${bookId}`);
            });
        });
    }

    function addListenersToGenres() {

        const menulist = document.querySelectorAll(".menu-item");
        menulist.forEach( menu => {
            menu.addEventListener('click', () => {
                const genreId = menu.getAttribute('data-id');
                performGetRequest(`api/genres/${genreId}/books`);
            });
        });

        addListenersToSubMenuBooks(  );
    }

    function addListenersToFilters( filter ) {
        const menulist = document.querySelectorAll(".menu-item");
        menulist.forEach( menu => {
            menu.addEventListener('click', () =>{
                const alphabet = menu.getAttribute('data-id');
                performGetRequest(`api/books?startsWith[${filter}]=${alphabet}`);
            });
        });

        if( filter === 'title') {
            addListenersToSubMenuBooks();
        }else {
            addListenersToSubMenuAuthors();
        }

    }

    function addListenersToSubMenuAuthors() {
        const subMenuBookList = document.querySelectorAll(".sub-side-menu >li");

        subMenuBookList.forEach( li => {
            li.addEventListener('click', () =>{
                const author = li.getAttribute('data-id');
                performGetRequest(`api/books/search?q[author]=${author}`);
            });
        });
    }

    function fetchAllGenres() {
        return fetch('api/genres?all=true')
                .then(res => res.ok ? res.json() : Promise.reject('unable to get genres from server')).
                catch( error => console.log(console.error))
                .then(data => data.genres);
    }

    function fetchPopularBooksOf( genre ) {
        return fetch(`api/genres/${genre.id}/books?orderBy=-votes`)
                .then(res => res.ok ? res.json() : Promise.reject(`unable to get books of genre: ${genre.name}`))
                .catch(error => console.log(error))
                .then( data => data.books );
    }

    function fetchBooksOf( genre ) {
        return fetch(`api/genres/${genre.id}/books`)
                .then(res => res.ok ? res.json() : Promise.reject(`unable to get books of genre: ${genre.name}`))
                .catch(error => console.log(error))
                .then( data => data.books );
    }

    function fetchBooksByFiltering( key , value) {
        return fetch(`api/books?startsWith[${key}]=${value}`)
                .then(res => res.ok ? res.json() : Promise.reject(`unable to get ${key} from server`))
                .catch(error => console.log(error))
                .then( data => data.books );
    }

    function setSideMenuGenres( genres , filter) {
        genres.forEach( genre => {
            filter( genre )
            .then(books => setSubSideMenu(books))
            .then( subMenu => {
                sideMenu.innerHTML += `<li><div data-id=${genre.id} class="menu-item">${genre.name}</div><ul class="sub-side-menu">${subMenu}</ul></li>`;
            })
            .then(() => {
                addListenersToMenuList();
                addListenersToGenres();
            });
        });
    }

    function setSubSideMenu( books ) {
        return new Promise( resolve => {
                    const list = books.map( book => {
                        const title = book.title.length < 20 ? book.title : book.title.substr(0,18).trim() + '...';

                        const listItem = `<li data-id=${book.isbn} ><a href="#book-details">${title}</a></li>`
                        return listItem;
                    });
                    resolve(list.join(''));
                });
    }


    function setSideMenu( filter ) {
        const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        alphabets.forEach( alphabet => {
            fetchBooksByFiltering( filter, alphabet )
            .then( books => (filter ==='title') ? setSubSideMenu(books) : setSubSideMenuForAuthors(books) )
            .then( subMenu => {
                sideMenu.innerHTML += `<li><div data-id=${alphabet} class="menu-item">${alphabet}</div><ul class="sub-side-menu">${subMenu}</ul></li>`;
            })
            .then( () => {
                addListenersToMenuList();
                addListenersToFilters( filter );
            });
        });
    }

    function setSubSideMenuForAuthors( books ) {
        const authors = new Set();

        books.forEach( book => {
            authors.add(book.author);
        });

        const list = [];
        authors.forEach( author => {
            const listItem = `<li data-id="${author}"><a href=#booklist> ${author} </a></li>`;
            list.push(listItem);
        });

        return new Promise( resolve => {
            resolve(list.join(''));
        });
    }

};
nav();

},{"./for-browserify-book-details":1,"./for-browserify-booklist":2}]},{},[1,2,3,4,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImZvci1icm93c2VyaWZ5LWJvb2stZGV0YWlscy5qcyIsImZvci1icm93c2VyaWZ5LWJvb2tsaXN0LmpzIiwiZm9yLWJyb3dzZXJpZnktY3JlYXRlLWJvb2suanMiLCJmb3ItYnJvd3NlcmlmeS1pbmRleC5qcyIsImZvci1icm93c2VyaWZ5LW5hdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImNvbnN0IHVzZXIgPSByZXF1aXJlKCcuL2Zvci1icm93c2VyaWZ5LWluZGV4Jyk7XG5jb25zdCBib29rID0ge31cbmxldCB1cmwgPSBudWxsO1xuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0NvbXBvbmVudHMoKSB7XG4gICAgLy9hZGRpbmcgbGlzdGVuZXJzIHRvIHRoZSBjb21wb25lbnRzXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZvdGUtYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB2b3RlVG9nZ2xlKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC1idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHJlbmRlclRvRWRpdCk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc2V0LWJ1dHRvbicpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVuZGVyVG9FZGl0KTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2F2ZS1idXR0b24nKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNhdmVCb29rRGV0YWlscyk7XG59XG5cbmZ1bmN0aW9uIHZvdGVUb2dnbGUoZXZlbnQpIHtcbiAgICAvL3RvZ2dsaW5nIHRoZSB2b3RlIGFuZCB2b3RlZCBidXR0b25zXG4gICAgaWYoZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygndm90ZWQnKSl7XG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCd2b3RlZCcpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudm90ZS1idXR0b24nKS5zcmMgPSAnaW1hZ2VzL3ZvdGUuc3ZnJztcbiAgICB9ZWxzZSB7XG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuYWRkKCd2b3RlZCcpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudm90ZS1idXR0b24nKS5zcmMgPSAnaW1hZ2VzL3ZvdGVkLnN2Zyc7XG4gICAgfVxuICAgIHBvc3REYXRhVG9TZXJ2ZXIoIGBhcGkvYm9va3MvJHtib29rLmlzYm59L3ZvdGVgLCB7IHVzZXIgOiB1c2VyfSk7XG4gICAgcmVuZGVyQm9va0Rlc2NyaXB0aW9uKCk7XG59XG5cbmZ1bmN0aW9uIHJlbmRlclRvRWRpdCgpIHtcbiAgICAvLyByZW5kZXJpbmcgdGhlIHNlY3Rpb24gdG8gZW5hYmxlIGVkaXRpbmdcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC1idXR0b24nKS5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc2V0LWJ1dHRvbicpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2F2ZS1idXR0b24nKS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9vay10aXRsZS1kZXRhaWxzJykub3V0ZXJIVE1MID0gYDxpbnB1dCBjbGFzcz1cImJvb2stdGl0bGUtZGV0YWlscyB0aXRsZVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCIke2Jvb2sudGl0bGV9XCI+YDtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWF1dGhvci1kZXRhaWxzJykub3V0ZXJIVE1MID0gYDxpbnB1dCBjbGFzcz1cImJvb2stYXV0aG9yLWRldGFpbHMgdGl0bGVcIiB0eXBlPVwidGV4dFwiIHZhbHVlPVwiJHtib29rLmF1dGhvcn1cIj5gO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stZ2VucmUtZGV0YWlscycpLm91dGVySFRNTCA9IGA8c2VsZWN0IGNsYXNzPVwiYm9vay1nZW5yZS1kZXRhaWxzIHRpdGxlXCI+IDxzZWxlY3Q+YDtcbiAgICBwb3B1bGF0ZUdlbnJlcygnLmJvb2stZ2VucmUtZGV0YWlscycsIHRydWUpO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stZGVzY3JpcHRpb24tZGV0YWlscycpLm91dGVySFRNTCA9IGA8ZGl2IGNsYXNzPVwiYm9vay1kZXNjcmlwdGlvbi1kZXRhaWxzIHRpdGxlIGVkaXQtZGVzY3JpcHRpb25cIiBjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCI+JHtib29rLmRlc2NyaXB0aW9ufTwvZGl2PmA7XG59XG5cbmZ1bmN0aW9uIHBvcHVsYXRlR2VucmVzKCBzZWxlY3Rvciwgc2V0T3B0aW9uRmxhZyApIHtcbiAgICBmZXRjaCgnYXBpL2dlbnJlcz9hbGw9dHJ1ZScpXG4gICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgLnRoZW4oZGF0YSA9PiBkYXRhLmdlbnJlcylcbiAgICAudGhlbiggZ2VucmVzID0+IHtcblxuICAgICAgICBjb25zdCBvcHRpb25zID0gZ2VucmVzLm1hcCggZ2VucmUgPT4ge1xuICAgICAgICAgICAgaWYoc2V0T3B0aW9uRmxhZyAmJiBnZW5yZS5pZCA9PT0gYm9vay5nZW5yZS5pZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGA8b3B0aW9uIGRhdGEtaWQ9XCIke2dlbnJlLmlkfVwiIGRhdGEtbmFtZT1cIiR7Z2VucmUubmFtZX1cIiBzZWxlY3RlZD4ke2dlbnJlLm5hbWV9PC9vcHRpb24+YFxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBgPG9wdGlvbiBkYXRhLWlkPVwiJHtnZW5yZS5pZH1cIiBkYXRhLW5hbWU9XCIke2dlbnJlLm5hbWV9XCI+JHtnZW5yZS5uYW1lfTwvb3B0aW9uPmBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuam9pbignXFxuJyk7XG5cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MID0gb3B0aW9ucztcbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZygnZXJyb3Igd2hpbGUgcG9wdWxhdGluZyBnZW5yZXMnICsgZXJyb3IpKTtcbn1cblxuZnVuY3Rpb24gc2F2ZUJvb2tEZXRhaWxzKCkge1xuICAgIC8vIHNhdmluZyB0aGUgYm9vayBkZXRhaWxzXG4gICAgYm9vay50aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLXRpdGxlLWRldGFpbHMnKS52YWx1ZTtcbiAgICBib29rLmF1dGhvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWF1dGhvci1kZXRhaWxzJykudmFsdWU7XG4gICAgY29uc3QgZ2VucmVFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stZ2VucmUtZGV0YWlscycpO1xuXG4gICAgY29uc3QgZ2VucmVPcHRpb24gPSBnZW5yZUVsZW1lbnQub3B0aW9uc1tnZW5yZUVsZW1lbnQuc2VsZWN0ZWRJbmRleF07XG5cbiAgICBib29rLmdlbnJlLmlkID0gZ2VucmVPcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgYm9vay5nZW5yZS5uYW1lID0gZ2VucmVPcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcbiAgICBib29rLmRlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stZGVzY3JpcHRpb24tZGV0YWlscycpLmlubmVySFRNTDtcbiAgICBwdXRCb29rRGV0YWlsc1RvU2V2ZXIoIGBhcGkvYm9va3MvJHtib29rLmlzYm59YCwge2Jvb2sgOiBib29rLCB1c2VyIDogdXNlcn0pXG4gICAgLnRoZW4oIHJlcyA9PiByZXMuc3RhdHVzKVxuICAgIC50aGVuKCBzdGF0dXMgPT4ge1xuICAgICAgICBpZiggc3RhdHVzID09PSAyMDQgKXtcbiAgICAgICAgICAgIHJlbmRlclNhdmVkQm9va0RhdGEoKTtcbiAgICAgICAgICAgIHJlbmRlckJvb2tEZXNjcmlwdGlvbigpO1xuICAgICAgICB9XG4gICAgfSlcbiAgICAuY2F0Y2goZXJyb3IgPT4gY29uc29sZS5sb2coJ2Vycm9yIHdoaWxlIHNhdmluZyB0aGUgYm9vaycgKyBlcnJvcikpO1xuXG59XG5cbmZ1bmN0aW9uIHB1dEJvb2tEZXRhaWxzVG9TZXZlciggdXJsLCBkYXRhKSB7XG4gICAgcmV0dXJuIGZldGNoKHVybCAsIHtcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXG4gICAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICAgIG1vZGU6ICdjb3JzJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9LFxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJTYXZlZEJvb2tEYXRhKCkge1xuICAgIC8vcmVuZGVyaW5nIHRoZSBzYXZlZCBib29rIGRldGFpbHNcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZWRpdC1idXR0b24nKS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlJyk7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc2V0LWJ1dHRvbicpLmNsYXNzTGlzdC5hZGQoJ2hpZGUnKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2F2ZS1idXR0b24nKS5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9vay10aXRsZS1kZXRhaWxzJykub3V0ZXJIVE1MID0gYDxoMSBjbGFzcz1cImJvb2stdGl0bGUtZGV0YWlscyB0aXRsZVwiPjwvaDE+IGA7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9vay1hdXRob3ItZGV0YWlscycpLm91dGVySFRNTCA9IGA8aDQgY2xhc3M9XCJib29rLWF1dGhvci1kZXRhaWxzIHRpdGxlXCI+PC9oND5gO1xuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stZ2VucmUtZGV0YWlscycpLm91dGVySFRNTCA9IGA8aDUgY2xhc3M9XCJib29rLWdlbnJlLWRldGFpbHMgdGl0bGVcIj48L2g1PmA7XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9vay1kZXNjcmlwdGlvbi1kZXRhaWxzJykub3V0ZXJIVE1MID0gYDxwIGNsYXNzPVwiYm9vay1kZXNjcmlwdGlvbi1kZXRhaWxzIHRpdGxlXCI8L3A+YDtcblxufVxuXG5mdW5jdGlvbiByZW5kZXJCb29rRGVzY3JpcHRpb24oKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stZGV0YWlscycpLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICBnZXRCb29rRGV0YWlsc0Zyb21TZXJ2ZXIodXJsKVxuICAgIC50aGVuKGJvb2tGZXRjaGVkID0+IHtcbiAgICAgICAgYm9vay50aXRsZSA9IGJvb2tGZXRjaGVkLnRpdGxlO1xuICAgICAgICBib29rLmltYWdlID0gYm9va0ZldGNoZWQuaW1hZ2U7XG4gICAgICAgIGJvb2suaXNibiA9IGJvb2tGZXRjaGVkLmlzYm47XG4gICAgICAgIGJvb2suYXV0aG9yID0gYm9va0ZldGNoZWQuYXV0aG9yO1xuICAgICAgICBib29rLmdlbnJlID0gYm9va0ZldGNoZWQuZ2VucmU7XG4gICAgICAgIGJvb2sudm90ZXMgPSBib29rRmV0Y2hlZC52b3RlcztcbiAgICAgICAgYm9vay5kZXNjcmlwdGlvbiA9IGJvb2tGZXRjaGVkLmRlc2NyaXB0aW9uO1xuICAgICAgICBib29rLnZvdGVkVXNlcnMgPSBib29rRmV0Y2hlZC52b3RlZFVzZXJzO1xuICAgICAgICBib29rLmNyZWF0ZWRVc2VycyA9IGJvb2tGZXRjaGVkLmNyZWF0ZWRVc2VycztcbiAgICB9KVxuICAgIC50aGVuKCAoKSA9PiB7XG4gICAgICAgIHNldEJvb2tEZXRhaWxzKCk7XG4gICAgICAgIHVwZGF0ZUxpc3RWaWV3KCk7XG4gICAgICAgIHJldHVybiBib29rLnZvdGVkVXNlcnM7XG4gICAgfSlcbiAgICAudGhlbiggdXNlcnMgPT4ge1xuICAgICAgICBjb25zdCB2b3RlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZvdGUtYnV0dG9uJyk7XG4gICAgICAgIGlmKHVzZXJzLmZpbmQoIHUgPT4gdS5pZCA9PT0gdXNlci5pZCApKXtcbiAgICAgICAgICAgIHZvdGVCdXR0b24uY2xhc3NMaXN0LmFkZCgndm90ZWQnKTtcbiAgICAgICAgICAgIHZvdGVCdXR0b24uc3JjID0gJ2ltYWdlcy92b3RlZC5zdmcnXG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHZvdGVCdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgndm90ZWQnKTtcbiAgICAgICAgICAgIHZvdGVCdXR0b24uc3JjID0gJ2ltYWdlcy92b3RlLnN2ZydcbiAgICAgICAgfVxuICAgICAgICBzZXRWb3RlZFVzZXJzKHVzZXJzKTtcbiAgICB9KVxuICAgIC5jYXRjaChlcnJvciA9PiBjb25zb2xlLmxvZygnZXJyb3IgaW4gYm9vay1kYXRhIHBhcnNpbmcnICsgZXJyb3IpKTtcblxufVxuXG5mdW5jdGlvbiBzZXRWb3RlZFVzZXJzKCB1c2VycyApIHtcbiAgICBjb25zdCBsaXN0ID0gdXNlcnMubWFwKCB1c2VyID0+IGA8bGk+JHt1c2VyLmlkfTwvbGk+YCkuam9pbignLCcpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52b3RlZC11c2VycycpLmlubmVySFRNTCA9IGxpc3Q7XG59XG5cbmZ1bmN0aW9uIHNldEJvb2tEZXRhaWxzKCkge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWRldGFpbHMnKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBib29rLmlzYm4pO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLXRpdGxlLWRldGFpbHMnKS5pbm5lckhUTUwgPSBib29rLnRpdGxlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWltYWdlLWRldGFpbHMnKS5zcmMgPSBib29rLmltYWdlO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWlzYm4tZGV0YWlscycpLmlubmVySFRNTCA9IGJvb2suaXNibjtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9vay1hdXRob3ItZGV0YWlscycpLmlubmVySFRNTCA9IGJvb2suYXV0aG9yO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWdlbnJlLWRldGFpbHMnKS5pbm5lckhUTUwgPSBib29rLmdlbnJlLm5hbWU7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stdm90ZXMtZGV0YWlscycpLmlubmVySFRNTCA9IGJvb2sudm90ZXM7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stZGVzY3JpcHRpb24tZGV0YWlscycpLmlubmVySFRNTCA9IGJvb2suZGVzY3JpcHRpb247XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3JlYXRlZC11c2VycycpLmlubmVySFRNTCA9ICdDcmVhdGVkIHVzZXJzOicgKyBzZXRDcmVhdGVkVXNlcnMoYm9vay5jcmVhdGVkVXNlcnMpO1xufVxuXG5mdW5jdGlvbiBzZXRDcmVhdGVkVXNlcnMoIHVzZXJzICkge1xuICAgIGNvbnN0IGxpc3QgPSB1c2Vycy5tYXAoIHVzZXIgPT4gdXNlci5pZCApLmpvaW4oJywnKTtcbiAgICByZXR1cm4gbGlzdDtcbn1cblxuZnVuY3Rpb24gZ2V0Qm9va0RldGFpbHNGcm9tU2VydmVyKCB1cmwgKSB7XG4gICAgcmV0dXJuIGZldGNoKHVybClcbiAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXG4gICAgICAgIC50aGVuKGRhdGEgPT4gZGF0YS5ib29rICk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpc3RWaWV3KCkge1xuICAgIGNvbnN0IHVwZGF0ZUJvb2sgPSByZXF1aXJlKCcuL2Zvci1icm93c2VyaWZ5LWJvb2tsaXN0JykudXBkYXRlQm9va1ZpZXc7XG4gICAgY29uc3QgYm9va2xpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYm9vaycpO1xuXG4gICAgYm9va2xpc3QuZm9yRWFjaCggaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IGl0ZW1JZCA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgIGlmKGl0ZW1JZCA9PT0gYm9vay5pc2JuKSB1cGRhdGVCb29rKCBib29rICk7XG4gICAgfSk7XG59XG5cbmNvbnN0IHJlbmRlckJvb2tEZXRhaWxzID0gKGJvb2tVcmwpID0+IHtcbiAgICB1cmwgPSBib29rVXJsO1xuICAgIHJlbmRlckJvb2tEZXNjcmlwdGlvbigpO1xufVxuXG5mdW5jdGlvbiBwb3N0RGF0YVRvU2VydmVyKHVybCwgZGF0YSkge1xuICAgIHJldHVybiBmZXRjaCh1cmwgLCB7XG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGRhdGEpLFxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5cbmFkZExpc3RlbmVyc1RvQ29tcG9uZW50cygpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICByZW5kZXJCb29rRGV0YWlscyxcbiAgICBwb3N0RGF0YVRvU2VydmVyLFxuICAgIGdldEJvb2tEZXRhaWxzRnJvbVNlcnZlcixcbiAgICBwb3B1bGF0ZUdlbnJlc1xufTtcbiIsImxldCBib29rSnNvbiA9IHt9O1xubGV0IGJvb2tMaXN0VXJsID0gbnVsbDtcbmxldCBtYXhQYWdlcyA9IDE7XG5jb25zdCBub09mQm9va3NQZXJQYWdlID0gODtcbmNvbnN0IHBhZ2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBhZ2VzJyk7XG5jb25zdCBib29rbGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rcycpO1xuXG5jb25zdCBnZXRVcmwgPSAoKSA9PiB7ICAgICAgICAgICAgICAgICAgICAgIC8vIFByb3ZpZGluZyB1cmwgZm9yIGZldGNoaW5nLiBVc2luZyB0aGlzIGZ1bmN0aW9uIHRvIGZldGNoIGRhdGEgZnJvbSBzZXJ2ZXJcbiAgICByZXR1cm4gJ2FwaS9ib29rcz9tYXhSZXN1bHRzPTQwJztcbn07XG5cbmNvbnN0IGNhbGxHZXRKc29uU2VydmljZSA9ICh1cmwpID0+IHtcbiAgICByZXR1cm4gZmV0Y2godXJsKVxuICAgIC50aGVuKHIgPT4ge1xuICAgICAgICByZXR1cm4gci5qc29uKCk7XG4gICAgfSk7XG59O1xuXG5jb25zdCBwZXJmb3JtR2V0UmVxdWVzdCA9ICggdXJsSW5wdXQsIHBhZ2UgKSA9PiB7ICAgICAgICAgICAvLyBVc2luZyB3aXRoIHRoZSBmdW5jdGlvbiBiZWZvcmUgdGhpcy4gVHJhbnNmZXJyaW5nIGZldGNoZWQgZGF0YSB0byBsb2NhbCB2YXJpYWJsZS4gQW5kIGVzdGFibGlzaGluZyBpbml0IHJlbmRlciBmdW5jaXRvblxuICAgIGNvbnN0IHVybCA9IHVybElucHV0IHx8IGdldFVybCgpO1xuXG4gICAgYm9va0xpc3RVcmwgPSB1cmw7XG4gICAgY2FsbEdldEpzb25TZXJ2aWNlKHVybClcbiAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgLy9wcm9jZXNzSnNvbihqc29uKTtcbiAgICAgICAgbWF4UGFnZXMgPSBNYXRoLmNlaWwoanNvbi5tYXhBdmFpbGFibGVCb29rcyAvIG5vT2ZCb29rc1BlclBhZ2UpO1xuICAgICAgICBib29rSnNvbiA9IGpzb247XG4gICAgICAgIHJlbmRlclBhZ2UoIHBhZ2UgKTtcbiAgICB9KTtcbn07XG5cbmZ1bmN0aW9uIHJlbmRlclBhZ2VCdXR0b25zKCBwYWdlICkge1xuICAgIGlmKCAhcGFnZSApIHBhZ2UgPSAxO1xuICAgIGlmKCBwYWdlIDwgMSkgcGFnZSA9IDE7XG4gICAgaWYoIHBhZ2UgPiBtYXhQYWdlcykgcGFnZSA9IG1heFBhZ2VzO1xuXG4gICAgY29uc3QgcmFuZ2VTdGFydCA9IChwYWdlLTEgPiAzKSA/IHBhZ2UtMiA6IDI7XG4gICAgY29uc3QgcmFuZ2VFbmQgPSAobWF4UGFnZXMtcGFnZSA+IDMpID8gcGFnZSsyIDogbWF4UGFnZXMtMTtcblxuICAgIHBhZ2VzLmlubmVySFRNTCA9ICc8bGkgY2xhc3M9XCJwcmV2aW91cy1wYWdlXCI+PGEgaHJlZj1cIiNib29rbGlzdFwiPiA8PCA8L2xpPlxcbic7XG4gICAgcGFnZXMuaW5uZXJIVE1MICs9ICc8bGkgY2xhc3M9XCJwYWdlXCIgcGFnZU5vPVwiMVwiPjxhIGhyZWY9XCIjYm9va2xpc3RcIj4gMTwvYT48L2xpPlxcbic7XG4gICAgaWYoIHJhbmdlU3RhcnQgIT0gMikgcGFnZXMuaW5uZXJIVE1MICs9ICcuLi5cXG4nO1xuXG4gICAgZm9yIChsZXQgaSA9IHJhbmdlU3RhcnQ7IGkgPD0gcmFuZ2VFbmQ7IGkrKykge1xuICAgICAgICBwYWdlcy5pbm5lckhUTUwgKz0gYDxsaSBjbGFzcz1cInBhZ2VcIiBwYWdlTm89XCIke2l9XCI+PGEgaHJlZj1cIiNib29rbGlzdFwiPiAke2l9PC9hPjwvbGk+XFxuYDtcbiAgICB9XG5cbiAgICBpZiggcmFuZ2VFbmQgIT0gbWF4UGFnZXMtMSApIHBhZ2VzLmlubmVySFRNTCArPSAnLi4uXFxuJztcbiAgICBwYWdlcy5pbm5lckhUTUwgKz0gYDxsaSBjbGFzcz1cInBhZ2VcIiBwYWdlTm89XCIke21heFBhZ2VzfVwiPjxhIGhyZWY9XCIjYm9va2xpc3RcIj4gJHttYXhQYWdlc308L2E+PC9saT5cXG5gO1xuICAgIHBhZ2VzLmlubmVySFRNTCArPSAnPGxpIGNsYXNzPVwibmV4dC1wYWdlXCI+PGEgaHJlZj1cIiNib29rbGlzdFwiPiA+PiA8L2xpPlxcbic7XG5cbiAgICBsZXQgYWN0aXZlUGFnZSA9IG51bGw7XG4gICAgY29uc3QgcGFnZUJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZScpO1xuICAgIHBhZ2VCdXR0b25zLmZvckVhY2goIHAgPT4ge1xuICAgICAgICBpZihwLmdldEF0dHJpYnV0ZSgncGFnZU5vJykgPT0gcGFnZSkgYWN0aXZlUGFnZSA9IHA7XG4gICAgfSk7XG5cbiAgICBhY3RpdmVQYWdlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgIGFkZExpc3RlbmVyc1RvUGFnZUJ1dHRvbnMoKTtcbn1cblxuZnVuY3Rpb24gYWRkTGlzdGVuZXJzVG9QYWdlQnV0dG9ucygpIHtcbiAgICBjb25zdCBwcmV2aW91c0J1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcmV2aW91cy1wYWdlJyk7XG4gICAgY29uc3QgcGFnZUJ1dHRvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFnZScpO1xuICAgIGNvbnN0IG5leHRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV4dC1wYWdlJyk7XG5cbiAgICBjb25zdCBjdXJyZW50UGFnZU5vID0gcGFyc2VJbnQoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wYWdlLmFjdGl2ZScpLmdldEF0dHJpYnV0ZSgncGFnZU5vJykgKTtcblxuICAgIGlmKGN1cnJlbnRQYWdlTm8gPT09IDEpe1xuICAgICAgICBwcmV2aW91c0J1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlZCcpO1xuICAgICAgICBuZXh0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuICAgIGVsc2UgaWYoY3VycmVudFBhZ2VObyA9PT0gbWF4UGFnZXMpe1xuICAgICAgICBwcmV2aW91c0J1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgICAgICBuZXh0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gICAgfWVsc2Uge1xuICAgICAgICBwcmV2aW91c0J1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgICAgICBuZXh0QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgcHJldmlvdXNCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xuICAgICAgICBpZihjdXJyZW50UGFnZU5vICE9IDEpIHJlbmRlclBhZ2UoIGN1cnJlbnRQYWdlTm8gLSAxKTtcbiAgICB9KTtcblxuICAgIG5leHRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xuICAgICAgICBpZihjdXJyZW50UGFnZU5vICE9IG1heFBhZ2VzKSByZW5kZXJQYWdlKCBjdXJyZW50UGFnZU5vICsgMSk7XG4gICAgfSk7XG5cbiAgICBwYWdlQnV0dG9ucy5mb3JFYWNoKCBidXR0b24gPT4ge1xuICAgICAgICBjb25zdCBwYWdlTm8gPSBwYXJzZUludChidXR0b24uZ2V0QXR0cmlidXRlKCdwYWdlTm8nKSk7XG4gICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgICAgICByZW5kZXJQYWdlKCBwYWdlTm8gKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRQYWdlRGF0YSggdXJsICwgcGFnZSkge1xuICAgIGNhbGxHZXRKc29uU2VydmljZSggdXJsIClcbiAgICAudGhlbihqc29uID0+IHtcbiAgICAgICAgYm9va0pzb24gPSBqc29uO1xuICAgICAgICByZW5kZXJQYWdlQnV0dG9ucyggcGFnZSApO1xuICAgICAgICByZW5kZXJib29rTGlzdCgpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiByZW5kZXJQYWdlKCBwYWdlICkge1xuICAgIGlmKCAhcGFnZSApIHBhZ2UgPSAxO1xuICAgIGlmKCBwYWdlIDwgMSkgcGFnZSA9IDE7XG4gICAgaWYoIHBhZ2UgPiBtYXhQYWdlcykgcGFnZSA9IG1heFBhZ2VzO1xuXG4gICAgY3VycmVudFBhZ2UgPSBwYWdlO1xuICAgIGNvbnN0IHN0YXJ0SW5kZXggPSAocGFnZSAtIDEpICogbm9PZkJvb2tzUGVyUGFnZTtcblxuICAgIGNvbnN0IG9yaWdpbiA9IG5ldyBVUkwoZG9jdW1lbnQubG9jYXRpb24pLm9yaWdpbjtcbiAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGJvb2tMaXN0VXJsLCBvcmlnaW4pO1xuXG4gICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ3N0YXJ0SW5kZXgnLCBzdGFydEluZGV4KTtcbiAgICB1cmwuc2VhcmNoUGFyYW1zLnNldCgnbWF4UmVzdWx0cycsIG5vT2ZCb29rc1BlclBhZ2UpO1xuXG4gICAgbG9hZFBhZ2VEYXRhKCB1cmwsIHBhZ2UgKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyYm9va0xpc3QoKSB7ICAgICAgICAgICAgICAgICAvLyBSZW5kZXIgZnVuY3Rpb24gZm9yIHRoZSBib29rIGxpc3QuIE1vZGlmeWluZyB0aGlzIGZ1bmN0aW9uIGFmdGVyIHNvcnQgZnVuY3Rpb24gaXMgZmluaXNoZWRcbiAgICBib29rbGlzdC5pbm5lckhUTUwgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vT2ZCb29rc1BlclBhZ2U7IGkrKykge1xuICAgICAgICBib29rbGlzdC5pbm5lckhUTUwgKz0gcmVuZGVyU2luZ2xlQm9vayhpKTtcblxuICAgIH1cblxuICAgIGFkZExpc3RlbmVyc1RvQ29tcG9uZW50cygpO1xufVxuXG5mdW5jdGlvbiByZW5kZXJTaW5nbGVCb29rKGlkKSB7ICAgICAgICAgICAgIC8vIFJlbmRpbmcgc2luZ2xlIGJvb2suIE5vIG1vcmUgbmVlZCBtb2RpZnlpbmcuXG4gICAgaWYoICFib29rSnNvbi5ib29rc1tpZF0gKSByZXR1cm4gJyc7XG5cbiAgICBjb25zdCBib29rID0gYm9va0pzb24uYm9va3NbaWRdO1xuICAgIGNvbnN0IGJvb2tIdG1sID0gZ2V0Qm9va0h0bWwoYm9vaywgaWQpO1xuICAgIGNvbnN0IGxpc3RJdGVtID0gYDxsaSBpZD1cImJvb2stJHtpZH1cIiBjbGFzcz1cImJvb2tcIiBkYXRhLWlkPVwiJHtib29rLmlzYm59XCI+JHtib29rSHRtbH08L2xpPmBcbiAgICByZXR1cm4gbGlzdEl0ZW07XG59XG5cbmZ1bmN0aW9uIGdldEJvb2tIdG1sKCBib29rLCBpZCApIHtcbiAgICBjb25zdCB0aXRsZSA9IGJvb2sudGl0bGUubGVuZ3RoIDwgNTAgPyBib29rLnRpdGxlIDogYm9vay50aXRsZS5zdWJzdHIoMCw0NykudHJpbSgpKycuLi4nO1xuICAgIGNvbnN0IGF1dGhvciA9IGJvb2suYXV0aG9yID8gYm9vay5hdXRob3IgOiBcInVua25vd25cIjtcbiAgICBjb25zdCBidXR0b24gPSBzZXRWb3RlQnV0dG9uKGJvb2spO1xuXG4gICAgY29uc3QgYm9va0h0bWwgPSBgPGEgaHJlZj1cIiNib29rLWRldGFpbHNcIj48aW1nIGNsYXNzPVwiYm9vay1pbWcgYm9vay1pbWctJHtpZH1cIiBzcmM9XCIke2Jvb2suaW1hZ2V9XCI+PC9hPlxuICAgIDxwIGNsYXNzPVwiYm9vay10aXRsZSBib29rLXRpdGxlLSR7aWR9XCI+JHt0aXRsZX08L3A+XG4gICAgPHAgY2xhc3M9XCJib29rLWF1dGhvciBib29rLWF1dGhvci0ke2lkfVwiPiR7YXV0aG9yfTwvcD5cbiAgICA8ZGl2IGNsYXNzPVwibGlrZVwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uLWxpa2VcIj4ke2J1dHRvbn08L2J1dHRvbj48cCBjbGFzcz1cImJvb2stdm90ZSBib29rLXZvdGUtJHtpZH1cIj4ke2Jvb2sudm90ZXN9PC9wPlxuICAgIDwvZGl2PmBcblxuICAgIHJldHVybiBib29rSHRtbDtcbn1cbmZ1bmN0aW9uIHNldFZvdGVCdXR0b24oYm9vaykge1xuICAgIGNvbnN0IHVzZXIgPSByZXF1aXJlKCcuL2Zvci1icm93c2VyaWZ5LWluZGV4Jyk7XG4gICAgY29uc3QgZm91bmRVc2VyID0gYm9vay52b3RlZFVzZXJzLmZpbmQoIHUgPT4gdS5pZCA9PT0gdXNlci5pZCApO1xuICAgIGlmKCBmb3VuZFVzZXIgKXtcbiAgICAgICAgcmV0dXJuICdjYW5jZWwnO1xuICAgIH1cbiAgICByZXR1cm4gJ3ZvdGUnO1xufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb0NvbXBvbmVudHMoKSB7ICAgICAgIC8vIEFkZCBsaXN0ZW5lcnMgdG8gY29tcG9uZW50cy4gTW9kaWZ5aW5nIGZvciBtb3JlIGludGVycmVhY3RpbmcgZnVuY3Rpb24uXG4gICAgbGV0IGFsbEltYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJvb2staW1nJyk7XG4gICAgZm9yIChsZXQgc2luZ2xlSW1hZ2Ugb2YgYWxsSW1hZ2UpIHtcbiAgICAgICAgc2luZ2xlSW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBib29rSW1hZ2VCdXR0b24pO1xuICAgIH1cbiAgICBsZXQgYWxsVm90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5idXR0b24tbGlrZScpO1xuICAgIGZvciAobGV0IHNpbmdsZVZvdGUgb2YgYWxsVm90ZSkge1xuICAgICAgICBzaW5nbGVWb3RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdm90ZUJ1dHRvbik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB2b3RlQnV0dG9uKGV2ZW50KSB7ICAgICAgICAgICAgICAgIC8vIEp1c3QgZm9yIFZvdGUuIE5vIG5lZWQgbW9yZSBtb2RpZnlpbmdcbiAgICBsZXQgcG9zVm90ZSA9IGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuaWQuc3Vic3RyKDUpO1xuICAgIGlmIChldmVudC50YXJnZXQuaW5uZXJIVE1MID09PSAndm90ZScpIHtcbiAgICAgICAgYm9va0pzb24uYm9va3NbcG9zVm90ZV0udm90ZXMgKz0gMTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stdm90ZS0nICsgcG9zVm90ZSkuaW5uZXJIVE1MID0gYm9va0pzb24uYm9va3NbcG9zVm90ZV0udm90ZXM7XG4gICAgICAgIGV2ZW50LnRhcmdldC5pbm5lckhUTUwgPSAnY2FuY2VsJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBib29rSnNvbi5ib29rc1twb3NWb3RlXS52b3RlcyAtPSAxO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9vay12b3RlLScgKyBwb3NWb3RlKS5pbm5lckhUTUwgPSBib29rSnNvbi5ib29rc1twb3NWb3RlXS52b3RlcztcbiAgICAgICAgZXZlbnQudGFyZ2V0LmlubmVySFRNTCA9ICd2b3RlJztcbiAgICB9XG4gICAgY29uc3QgYm9vayA9IGJvb2tKc29uLmJvb2tzW3Bvc1ZvdGVdO1xuICAgIGNvbnN0IHBvc3RWb3RlRGF0YVRvU2VydmVyID0gcmVxdWlyZSgnLi9mb3ItYnJvd3NlcmlmeS1ib29rLWRldGFpbHMnKS5wb3N0RGF0YVRvU2VydmVyO1xuICAgIGNvbnN0IHVzZXIgPSByZXF1aXJlKCcuL2Zvci1icm93c2VyaWZ5LWluZGV4Jyk7XG4gICAgcG9zdFZvdGVEYXRhVG9TZXJ2ZXIoYGFwaS9ib29rcy8ke2Jvb2suaXNibn0vdm90ZWAsIHsgdXNlciA6IHVzZXIgfSk7XG5cbiAgICBjb25zdCBib29rRGV0YWlscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWRldGFpbHMnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKVxuICAgIGlmKCBib29rRGV0YWlscyA9PT0gYm9vay5pc2JuICkgcmVuZGVyRGV0YWlscyggYm9vayApO1xufVxuXG5mdW5jdGlvbiBib29rSW1hZ2VCdXR0b24oZXZlbnQpIHsgICAgICAgICAgIC8vIEp1c3QgZm9yIFZvdGUuIE1vZGlmeWluZyBhZnRlciBwYWdlIG51bWJlciBmdW50aW9uIGlzIGZpbmlzaGVkXG5cbiAgICBsZXQgcG9zSW1hZ2UgPSBldmVudC50YXJnZXQuY2xhc3NMaXN0WzFdLnN1YnN0cig5KTtcbiAgICBsZXQgYm9vayA9IGJvb2tKc29uLmJvb2tzW3Bvc0ltYWdlXTtcblxuICAgIHJlbmRlckRldGFpbHMoIGJvb2sgKTtcbn1cblxuZnVuY3Rpb24gcmVuZGVyRGV0YWlscyggYm9vayApIHtcbiAgICBjb25zdCByZW5kZXJCb29rRGV0YWlscyA9IHJlcXVpcmUoJy4vZm9yLWJyb3dzZXJpZnktYm9vay1kZXRhaWxzJykucmVuZGVyQm9va0RldGFpbHM7XG4gICAgcmVuZGVyQm9va0RldGFpbHMoYGFwaS9ib29rcy8ke2Jvb2suaXNibn1gKTtcbn1cblxuY29uc3Qgb3JkZXJPcHRpb25zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm9yZGVyLXNlbGVjdCcpO1xuY29uc3Qgb3JkZXJCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3JkZXItYnV0dG9uJyk7XG5cbm9yZGVyQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb3JkZXJCb29rcyk7XG5vcmRlck9wdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgb3JkZXJCb29rcyk7XG5cbmZ1bmN0aW9uIG9yZGVyQm9va3MoKSB7XG4gICAgY29uc3Qgb3JpZ2luID0gbmV3IFVSTChkb2N1bWVudC5sb2NhdGlvbikub3JpZ2luO1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwoYm9va0xpc3RVcmwsIG9yaWdpbik7XG5cblxuICAgIGlmKG9yZGVyT3B0aW9ucy52YWx1ZSA9PSAxKXtcbiAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoICdvcmRlckJ5JywgJ3RpdGxlJyApO1xuICAgICAgICBwZXJmb3JtR2V0UmVxdWVzdCh1cmwpO1xuICAgIH1lbHNlIHtcbiAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoJ29yZGVyQnknLCAnLXZvdGVzJyApXG4gICAgICAgIHBlcmZvcm1HZXRSZXF1ZXN0KHVybCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1cGRhdGVCb29rVmlldyggYm9va1RvVXBkYXRlICkge1xuICAgIGNvbnN0IGlkID0gYm9va0pzb24uYm9va3MuZmluZEluZGV4KCBib29rID0+IGJvb2suaXNibiA9PT0gYm9va1RvVXBkYXRlLmlzYm4gKTtcblxuICAgIGNvbnN0IGZldGNoQm9va0RldGFpbHMgPSByZXF1aXJlKCcuL2Zvci1icm93c2VyaWZ5LWJvb2stZGV0YWlscycpLmdldEJvb2tEZXRhaWxzRnJvbVNlcnZlcjtcbiAgICBpZiggaWQgPj0gMCl7XG5cbiAgICAgICAgZmV0Y2hCb29rRGV0YWlscyggYGFwaS9ib29rcy8ke2Jvb2tUb1VwZGF0ZS5pc2JufWApXG4gICAgICAgIC50aGVuKCBib29rID0+IHtcbiAgICAgICAgICAgIGJvb2tKc29uLmJvb2tzW2lkXSA9IGJvb2s7XG4gICAgICAgICAgICBjb25zdCB0YXJnZXRCb29rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2Jvb2stJHtpZH1gKTtcblxuICAgICAgICAgICAgdGFyZ2V0Qm9vay5pbm5lckhUTUwgPSBnZXRCb29rSHRtbCggYm9va0pzb24uYm9va3NbaWRdLCBpZCApO1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2Jvb2stJHtpZH0gLmJ1dHRvbi1saWtlYCk7XG4gICAgICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB2b3RlQnV0dG9uKTtcblxuICAgICAgICAgICAgY29uc3QgaW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2Jvb2stJHtpZH0gLmJvb2staW1nYCk7XG4gICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBib29rSW1hZ2VCdXR0b24pO1xuICAgICAgICB9KTtcblxuICAgIH1cblxufVxucGVyZm9ybUdldFJlcXVlc3QoKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBwZXJmb3JtR2V0UmVxdWVzdCxcbiAgICB1cGRhdGVCb29rVmlld1xufTtcbiIsImNvbnN0IHVzZXIgPSByZXF1aXJlKCcuL2Zvci1icm93c2VyaWZ5LWluZGV4Jyk7XG5cbmNvbnN0IGJvb2sgPSB7fTtcbmNvbnN0IHBvc3REYXRhVG9TZXJ2ZXIgPSByZXF1aXJlKCcuL2Zvci1icm93c2VyaWZ5LWJvb2stZGV0YWlscycpLnBvc3REYXRhVG9TZXJ2ZXI7XG5cblxuZnVuY3Rpb24gY3JlYXRlQm9vaygpIHtcbiAgICBib29rLnRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stdGl0bGUtaW5wdXQnKS52YWx1ZTtcbiAgICBib29rLmF1dGhvciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWF1dGhvci1pbnB1dCcpLnZhbHVlO1xuICAgIGJvb2suaW1hZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9vay1pbWFnZS1pbnB1dCcpLnZhbHVlO1xuICAgIGJvb2suZGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9vay1kZXNjcmlwdGlvbi1pbnB1dCcpLnZhbHVlO1xuICAgIGNvbnN0IGdlbnJlRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWdlbnJlLWlucHV0Jyk7XG5cbiAgICBjb25zdCBnZW5yZU9wdGlvbiA9IGdlbnJlRWxlbWVudC5vcHRpb25zW2dlbnJlRWxlbWVudC5zZWxlY3RlZEluZGV4XTtcbiAgICBib29rLmdlbnJlID17fTtcbiAgICBib29rLmdlbnJlLmlkID0gZ2VucmVPcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgYm9vay5nZW5yZS5uYW1lID0gZ2VucmVPcHRpb24uZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKTtcblxuICAgIHBvc3REYXRhVG9TZXJ2ZXIoJ2FwaS9ib29rcy9ib29rJywge3VzZXIgOiB1c2VyLCBib29rIDogYm9vayB9KVxuICAgIC50aGVuKCByZXMgPT4ge1xuICAgICAgICBjb25zdCBzdGF0dXNTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNyZWF0ZS1ib29rLXN0YXR1cycpO1xuICAgICAgICBzdGF0dXNTcGFuLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGUnKTtcbiAgICAgICAgaWYocmVzLnN0YXR1cyA9PT0gMjA0KXtcbiAgICAgICAgICAgIHN0YXR1c1NwYW4uaW5uZXJIVE1MID0gXCJzdWNjZXNzZnVsbHkgY3JlYXRlZFwiO1xuICAgICAgICAgICAgcmVuZGVyQ3JlYXRlQm9vaygpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBzdGF0dXNTcGFuLmlubmVySFRNTCA9IFwicHJvdmlkZSB2YWxpZCBkYXRhXCI7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgc3RhdHVzU3Bhbi5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG4gICAgICAgIH0sIDIwMDApO1xuICAgIH0pO1xuXG59XG5cbmZ1bmN0aW9uIHJlbmRlckNyZWF0ZUJvb2soKSB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stdGl0bGUtaW5wdXQnKS52YWx1ZSA9ICcnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWF1dGhvci1pbnB1dCcpLnZhbHVlID0gJyc7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2staW1hZ2UtaW5wdXQnKS52YWx1ZSA9ICcnO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib29rLWRlc2NyaXB0aW9uLWlucHV0JykudmFsdWUgPSAnJztcbiAgICBjb25zdCBwb3B1bGF0ZUdlbnJlcyA9IHJlcXVpcmUoJy4vZm9yLWJyb3dzZXJpZnktYm9vay1kZXRhaWxzJykucG9wdWxhdGVHZW5yZXM7XG5cbiAgICBwb3B1bGF0ZUdlbnJlcygnLmJvb2stZ2VucmUtaW5wdXQnKTtcbn1cblxucmVuZGVyQ3JlYXRlQm9vaygpO1xuY29uc3QgY3JlYXRlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvb2stY3JlYXRlLWJ1dHRvbicpO1xuY3JlYXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY3JlYXRlQm9vayk7XG5cbmNvbnN0IGNsb3NlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNyZWF0ZS1ib29rLWNsb3NlJyk7XG5jbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZS1ib29rJykuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xufSk7XG5cbmNvbnN0IGNyZWF0ZUJvb2tOYXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmF2LWNyZWF0ZScpO1xuY3JlYXRlQm9va05hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NyZWF0ZS1ib29rJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZScpO1xuICAgIHJlbmRlckNyZWF0ZUJvb2soKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlckNyZWF0ZUJvb2s7XG4iLCIgICAgY29uc3QgcGVyZm9ybUdldFJlcXVlc3QgPSByZXF1aXJlKCcuL2Zvci1icm93c2VyaWZ5LWJvb2tsaXN0JykucGVyZm9ybUdldFJlcXVlc3Q7XG5sZXQgc2xpZGVJbmRleD0wO1xuc2hvd1NsaWRlcygpO1xuYWRkTGlzdGVuZXJzVG9TZWFyY2hCYXIoKTtcbmNvbnN0IHVzZXIgPSB7fTtcblxuZ2V0VXNlcigpO1xuZnVuY3Rpb24gZ2V0VXNlcigpIHtcbiAgICBmZXRjaCgndXNlcnMnLHtcbiAgICAgICAgbWV0aG9kIDogJ1BPU1QnXG4gICAgfSlcbiAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcbiAgICAudGhlbihkYXRhID0+IGRhdGEudXNlcilcbiAgICAudGhlbihmZXRjaGVkVXNlciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCk7XG4gICAgICAgIHVzZXIuaWQgPSBmZXRjaGVkVXNlci5pZDtcbiAgICAgICAgbm90aWZ5VXNlcigpO1xuICAgIH0pXG4gICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKCdlcnJvciB3aGlsZSBmZXRjaGluZyB1c2VyOiAnICsgZXJyb3IpKTtcblxufVxuXG5mdW5jdGlvbiBub3RpZnlVc2VyKCkge1xuICAgIGNvbnN0IHdlbGNvbWVOb3RlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnVzZXItd2VsY29tZScpO1xuICAgIHdlbGNvbWVOb3RlLmlubmVySFRNTCA9IGB3ZWxjb21lIHVzZXIgJHt1c2VyLmlkfWA7XG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICB3ZWxjb21lTm90ZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHdlbGNvbWVOb3RlKTtcbiAgICB9LCAyMDAwKTtcblxufVxuXG5mdW5jdGlvbiBzaG93U2xpZGVzKCkge1xuICAgIGxldCBpO1xuICAgIGxldCBzbGlkZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwic2xpZGVzXCIpO1xuICAgIGxldCBkb3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImRvdFwiKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgc2xpZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgc2xpZGVzW2ldLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgc2xpZGVJbmRleCsrO1xuICAgIGlmIChzbGlkZUluZGV4ID4gc2xpZGVzLmxlbmd0aCkge3NsaWRlSW5kZXggPSAxfVxuICAgIGZvciAoaSA9IDA7IGkgPCBkb3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRvdHNbaV0uY2xhc3NOYW1lID0gZG90c1tpXS5jbGFzc05hbWUucmVwbGFjZShcIiBhY3RpdmVcIiwgXCJcIik7XG4gICAgfVxuICAgIHNsaWRlc1tzbGlkZUluZGV4LTFdLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgZG90c1tzbGlkZUluZGV4LTFdLmNsYXNzTmFtZSArPSBcIiBhY3RpdmVcIjtcbiAgICBzZXRUaW1lb3V0KHNob3dTbGlkZXMsIDIwMDApO1xufVxuXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcnNUb1NlYXJjaEJhcigpIHtcblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtaW5wdXQnKS5hZGRFdmVudExpc3RlbmVyKCAna2V5cHJlc3MnLCBjaGVja0tleUFuZFBlcmZvcm1TZWFyY2gpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtZm9ybSA+YnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWFyY2hCeUtleXdvcmRzKTtcbn1cblxuZnVuY3Rpb24gY2hlY2tLZXlBbmRQZXJmb3JtU2VhcmNoKCBldmVudCApIHtcbiAgICBpZihldmVudC5rZXlDb2RlID09PSAxMyApe1xuICAgICAgICBzZWFyY2hCeUtleXdvcmRzKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzZWFyY2hCeUtleXdvcmRzKCl7XG4gICAgbGV0IGtleXdvcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaC1pbnB1dCcpLnZhbHVlO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib29rbGlzdCcpLnNjcm9sbEludG9WaWV3KCk7XG5cbiAgICBpZihrZXl3b3Jkcyl7XG4gICAgICAgIGtleXdvcmRzID0ga2V5d29yZHMucmVwbGFjZSgvXFxzL2csICcrJyk7XG4gICAgICAgIHBlcmZvcm1HZXRSZXF1ZXN0KGBhcGkvYm9va3Mvc2VhcmNoP3Fba2V5d29yZHNdPSR7a2V5d29yZHN9YCk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVzZXI7XG4iLCJjb25zdCBwZXJmb3JtR2V0UmVxdWVzdCA9IHJlcXVpcmUoJy4vZm9yLWJyb3dzZXJpZnktYm9va2xpc3QnKS5wZXJmb3JtR2V0UmVxdWVzdDtcbmNvbnN0IG5hdiA9ICgpID0+IHtcblxuICAgIGNvbnN0IHNpZGVNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpZGUtbWVudScpO1xuICAgIGNvbnN0IHNlYXJjaEJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb3JuZXItc2VhcmNoJyk7XG4gICAgY29uc3Qgc2VhcmNoSWNvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzZWFyY2gtaWNvbicpO1xuICAgIGNvbnN0IGdlbnJlTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI25hdi1nZW5yZScpO1xuICAgIGNvbnN0IGF1dGhvck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXYtYXV0aG9yJyk7XG4gICAgY29uc3QgdGl0bGVOYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmF2LXRpdGxlJyk7XG4gICAgY29uc3QgcG9wdWxhck5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuYXYtcG9wdWxhcicpO1xuXG4gICAgc2VhcmNoSWNvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+e1xuICAgICAgICBpZiggd2luZG93LmdldENvbXB1dGVkU3R5bGUoIHNlYXJjaEJhciwgJ3N0eWxlJykuZGlzcGxheT09PSdub25lJyl7XG4gICAgICAgICAgICBzZWFyY2hCYXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5OmlubGluZScpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBwZXJmb3JtU2VhcmNoKCk7XG4gICAgICAgICAgICBzZWFyY2hCYXIuc2V0QXR0cmlidXRlKCdzdHlsZScsICdkaXNwbGF5Om5vbmUnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2VhcmNoQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXByZXNzJywgKGV2ZW50KT0+e1xuICAgICAgICBpZihldmVudC5rZXkgPT09ICdFbnRlcicpe1xuICAgICAgICAgICAgcGVyZm9ybVNlYXJjaCgpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBnZW5yZU5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT57XG4gICAgICAgIHNpZGVNZW51LmlubmVySFRNTCA9ICcnO1xuICAgICAgICBmZXRjaEFsbEdlbnJlcygpXG4gICAgICAgIC50aGVuKGdlbnJlcyA9PiBzZXRTaWRlTWVudUdlbnJlcyggZ2VucmVzLCBmZXRjaEJvb2tzT2YgKSk7XG4gICAgfSk7XG5cbiAgICBhdXRob3JOYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xuICAgICAgICBzaWRlTWVudS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgc2V0U2lkZU1lbnUoJ2F1dGhvcicpO1xuICAgIH0pO1xuXG4gICAgdGl0bGVOYXYuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+e1xuICAgICAgICBzaWRlTWVudS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgc2V0U2lkZU1lbnUoJ3RpdGxlJyk7XG4gICAgfSk7XG5cbiAgICBwb3B1bGFyTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PntcbiAgICAgICAgcGVyZm9ybUdldFJlcXVlc3QoJ2FwaS9ib29rcz9vcmRlckJ5PS12b3RlcycpO1xuICAgICAgICBzaWRlTWVudS5pbm5lckhUTUwgPSAnJztcbiAgICAgICAgZmV0Y2hBbGxHZW5yZXMoKVxuICAgICAgICAudGhlbiggZ2VucmVzID0+IHtcbiAgICAgICAgICAgIHNldFNpZGVNZW51R2VucmVzKCBnZW5yZXMsIGZldGNoUG9wdWxhckJvb2tzT2YgKVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHBlcmZvcm1TZWFyY2goKSB7XG4gICAgICAgIGxldCBrZXl3b3JkcyA9IHNlYXJjaEJhci52YWx1ZTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jvb2tsaXN0Jykuc2Nyb2xsSW50b1ZpZXcoKTtcblxuICAgICAgICBpZihrZXl3b3Jkcyl7XG4gICAgICAgICAgICBrZXl3b3JkcyA9IGtleXdvcmRzLnJlcGxhY2UoL1xccy9nLCAnKycpO1xuICAgICAgICAgICAgcGVyZm9ybUdldFJlcXVlc3QoYGFwaS9ib29rcy9zZWFyY2g/cVtrZXl3b3Jkc109JHtrZXl3b3Jkc31gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvTWVudUxpc3QoKSB7XG4gICAgICAgIGNvbnN0IG1lbnVsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tZW51LWl0ZW1cIik7XG4gICAgICAgIGNvbnN0IHN1Ym1lbnVsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWItc2lkZS1tZW51XCIpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbWVudWxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1lbnVsaXN0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHN1Ym1lbnVsaXN0W2ldLCAnc3R5bGUnKS5kaXNwbGF5PT09J25vbmUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Ym1lbnVsaXN0W2ldLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpibG9jaycpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Ym1lbnVsaXN0W2ldLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnZGlzcGxheTpub25lJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzVG9TdWJNZW51Qm9va3MoIHBhcmVudExpc3RVcmwgKSB7XG4gICAgICAgIGNvbnN0IHN1Yk1lbnVCb29rTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3ViLXNpZGUtbWVudSA+bGlcIik7XG5cbiAgICAgICAgY29uc3QgcmVuZGVyQm9va0RldGFpbHMgPSByZXF1aXJlKCcuL2Zvci1icm93c2VyaWZ5LWJvb2stZGV0YWlscycpLnJlbmRlckJvb2tEZXRhaWxzO1xuICAgICAgICBzdWJNZW51Qm9va0xpc3QuZm9yRWFjaCggbGkgPT4ge1xuICAgICAgICAgICAgbGkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PntcbiAgICAgICAgICAgICAgICBjb25zdCBib29rSWQgPSBsaS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgICAgICByZW5kZXJCb29rRGV0YWlscyhgYXBpL2Jvb2tzLyR7Ym9va0lkfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvR2VucmVzKCkge1xuXG4gICAgICAgIGNvbnN0IG1lbnVsaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5tZW51LWl0ZW1cIik7XG4gICAgICAgIG1lbnVsaXN0LmZvckVhY2goIG1lbnUgPT4ge1xuICAgICAgICAgICAgbWVudS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBnZW5yZUlkID0gbWVudS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgICAgICBwZXJmb3JtR2V0UmVxdWVzdChgYXBpL2dlbnJlcy8ke2dlbnJlSWR9L2Jvb2tzYCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWRkTGlzdGVuZXJzVG9TdWJNZW51Qm9va3MoICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvRmlsdGVycyggZmlsdGVyICkge1xuICAgICAgICBjb25zdCBtZW51bGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubWVudS1pdGVtXCIpO1xuICAgICAgICBtZW51bGlzdC5mb3JFYWNoKCBtZW51ID0+IHtcbiAgICAgICAgICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PntcbiAgICAgICAgICAgICAgICBjb25zdCBhbHBoYWJldCA9IG1lbnUuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICAgICAgcGVyZm9ybUdldFJlcXVlc3QoYGFwaS9ib29rcz9zdGFydHNXaXRoWyR7ZmlsdGVyfV09JHthbHBoYWJldH1gKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiggZmlsdGVyID09PSAndGl0bGUnKSB7XG4gICAgICAgICAgICBhZGRMaXN0ZW5lcnNUb1N1Yk1lbnVCb29rcygpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBhZGRMaXN0ZW5lcnNUb1N1Yk1lbnVBdXRob3JzKCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVyc1RvU3ViTWVudUF1dGhvcnMoKSB7XG4gICAgICAgIGNvbnN0IHN1Yk1lbnVCb29rTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3ViLXNpZGUtbWVudSA+bGlcIik7XG5cbiAgICAgICAgc3ViTWVudUJvb2tMaXN0LmZvckVhY2goIGxpID0+IHtcbiAgICAgICAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT57XG4gICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gbGkuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJyk7XG4gICAgICAgICAgICAgICAgcGVyZm9ybUdldFJlcXVlc3QoYGFwaS9ib29rcy9zZWFyY2g/cVthdXRob3JdPSR7YXV0aG9yfWApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZldGNoQWxsR2VucmVzKCkge1xuICAgICAgICByZXR1cm4gZmV0Y2goJ2FwaS9nZW5yZXM/YWxsPXRydWUnKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMub2sgPyByZXMuanNvbigpIDogUHJvbWlzZS5yZWplY3QoJ3VuYWJsZSB0byBnZXQgZ2VucmVzIGZyb20gc2VydmVyJykpLlxuICAgICAgICAgICAgICAgIGNhdGNoKCBlcnJvciA9PiBjb25zb2xlLmxvZyhjb25zb2xlLmVycm9yKSlcbiAgICAgICAgICAgICAgICAudGhlbihkYXRhID0+IGRhdGEuZ2VucmVzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmZXRjaFBvcHVsYXJCb29rc09mKCBnZW5yZSApIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBhcGkvZ2VucmVzLyR7Z2VucmUuaWR9L2Jvb2tzP29yZGVyQnk9LXZvdGVzYClcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLm9rID8gcmVzLmpzb24oKSA6IFByb21pc2UucmVqZWN0KGB1bmFibGUgdG8gZ2V0IGJvb2tzIG9mIGdlbnJlOiAke2dlbnJlLm5hbWV9YCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSlcbiAgICAgICAgICAgICAgICAudGhlbiggZGF0YSA9PiBkYXRhLmJvb2tzICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmV0Y2hCb29rc09mKCBnZW5yZSApIHtcbiAgICAgICAgcmV0dXJuIGZldGNoKGBhcGkvZ2VucmVzLyR7Z2VucmUuaWR9L2Jvb2tzYClcbiAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4gcmVzLm9rID8gcmVzLmpzb24oKSA6IFByb21pc2UucmVqZWN0KGB1bmFibGUgdG8gZ2V0IGJvb2tzIG9mIGdlbnJlOiAke2dlbnJlLm5hbWV9YCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSlcbiAgICAgICAgICAgICAgICAudGhlbiggZGF0YSA9PiBkYXRhLmJvb2tzICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmV0Y2hCb29rc0J5RmlsdGVyaW5nKCBrZXkgLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gZmV0Y2goYGFwaS9ib29rcz9zdGFydHNXaXRoWyR7a2V5fV09JHt2YWx1ZX1gKVxuICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiByZXMub2sgPyByZXMuanNvbigpIDogUHJvbWlzZS5yZWplY3QoYHVuYWJsZSB0byBnZXQgJHtrZXl9IGZyb20gc2VydmVyYCkpXG4gICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKSlcbiAgICAgICAgICAgICAgICAudGhlbiggZGF0YSA9PiBkYXRhLmJvb2tzICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0U2lkZU1lbnVHZW5yZXMoIGdlbnJlcyAsIGZpbHRlcikge1xuICAgICAgICBnZW5yZXMuZm9yRWFjaCggZ2VucmUgPT4ge1xuICAgICAgICAgICAgZmlsdGVyKCBnZW5yZSApXG4gICAgICAgICAgICAudGhlbihib29rcyA9PiBzZXRTdWJTaWRlTWVudShib29rcykpXG4gICAgICAgICAgICAudGhlbiggc3ViTWVudSA9PiB7XG4gICAgICAgICAgICAgICAgc2lkZU1lbnUuaW5uZXJIVE1MICs9IGA8bGk+PGRpdiBkYXRhLWlkPSR7Z2VucmUuaWR9IGNsYXNzPVwibWVudS1pdGVtXCI+JHtnZW5yZS5uYW1lfTwvZGl2Pjx1bCBjbGFzcz1cInN1Yi1zaWRlLW1lbnVcIj4ke3N1Yk1lbnV9PC91bD48L2xpPmA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFkZExpc3RlbmVyc1RvTWVudUxpc3QoKTtcbiAgICAgICAgICAgICAgICBhZGRMaXN0ZW5lcnNUb0dlbnJlcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFN1YlNpZGVNZW51KCBib29rcyApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCByZXNvbHZlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlzdCA9IGJvb2tzLm1hcCggYm9vayA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0aXRsZSA9IGJvb2sudGl0bGUubGVuZ3RoIDwgMjAgPyBib29rLnRpdGxlIDogYm9vay50aXRsZS5zdWJzdHIoMCwxOCkudHJpbSgpICsgJy4uLic7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGxpc3RJdGVtID0gYDxsaSBkYXRhLWlkPSR7Ym9vay5pc2JufSA+PGEgaHJlZj1cIiNib29rLWRldGFpbHNcIj4ke3RpdGxlfTwvYT48L2xpPmBcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0SXRlbTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobGlzdC5qb2luKCcnKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBzZXRTaWRlTWVudSggZmlsdGVyICkge1xuICAgICAgICBjb25zdCBhbHBoYWJldHMgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonLnNwbGl0KCcnKTtcblxuICAgICAgICBhbHBoYWJldHMuZm9yRWFjaCggYWxwaGFiZXQgPT4ge1xuICAgICAgICAgICAgZmV0Y2hCb29rc0J5RmlsdGVyaW5nKCBmaWx0ZXIsIGFscGhhYmV0IClcbiAgICAgICAgICAgIC50aGVuKCBib29rcyA9PiAoZmlsdGVyID09PSd0aXRsZScpID8gc2V0U3ViU2lkZU1lbnUoYm9va3MpIDogc2V0U3ViU2lkZU1lbnVGb3JBdXRob3JzKGJvb2tzKSApXG4gICAgICAgICAgICAudGhlbiggc3ViTWVudSA9PiB7XG4gICAgICAgICAgICAgICAgc2lkZU1lbnUuaW5uZXJIVE1MICs9IGA8bGk+PGRpdiBkYXRhLWlkPSR7YWxwaGFiZXR9IGNsYXNzPVwibWVudS1pdGVtXCI+JHthbHBoYWJldH08L2Rpdj48dWwgY2xhc3M9XCJzdWItc2lkZS1tZW51XCI+JHtzdWJNZW51fTwvdWw+PC9saT5gO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYWRkTGlzdGVuZXJzVG9NZW51TGlzdCgpO1xuICAgICAgICAgICAgICAgIGFkZExpc3RlbmVyc1RvRmlsdGVycyggZmlsdGVyICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0U3ViU2lkZU1lbnVGb3JBdXRob3JzKCBib29rcyApIHtcbiAgICAgICAgY29uc3QgYXV0aG9ycyA9IG5ldyBTZXQoKTtcblxuICAgICAgICBib29rcy5mb3JFYWNoKCBib29rID0+IHtcbiAgICAgICAgICAgIGF1dGhvcnMuYWRkKGJvb2suYXV0aG9yKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xuICAgICAgICBhdXRob3JzLmZvckVhY2goIGF1dGhvciA9PiB7XG4gICAgICAgICAgICBjb25zdCBsaXN0SXRlbSA9IGA8bGkgZGF0YS1pZD1cIiR7YXV0aG9yfVwiPjxhIGhyZWY9I2Jvb2tsaXN0PiAke2F1dGhvcn0gPC9hPjwvbGk+YDtcbiAgICAgICAgICAgIGxpc3QucHVzaChsaXN0SXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKGxpc3Quam9pbignJykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn07XG5uYXYoKTtcbiJdfQ==
