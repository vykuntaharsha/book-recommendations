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
    postVoteDataToServer( `api/books/${book.isbn}/vote`, { user : user});
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
    populateGenres();

    document.querySelector('.book-description-details').outerHTML = `<div class="book-description-details title edit-description" contenteditable="true">${book.description}</div>`;
}

function populateGenres() {
    fetch('api/genres?all=true')
    .then(res => res.json())
    .then(data => data.genres)
    .then( genres => {

        const options = genres.map( genre => {
            if(genre.id === book.genre.id){
                return `<option data-id="${genre.id}" data-name="${genre.name}" selected>${genre.name}</option>`
            }else {
                return `<option data-id="${genre.id}" data-name="${genre.name}">${genre.name}</option>`
            }
        }).join('\n');

        document.querySelector('.book-genre-details').innerHTML = options;
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

    putBookDetailsToSever( `api/books/${book.isbn}`, {book : book})
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

function postVoteDataToServer(url, data) {
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
    postVoteDataToServer,
    getBookDetailsFromServer
};

},{"./for-browserify-booklist":2,"./for-browserify-index":3}],2:[function(require,module,exports){
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

},{"./for-browserify-book-details":1,"./for-browserify-index":3}],3:[function(require,module,exports){
const performGetRequest = require('./for-browserify-booklist');
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

},{"./for-browserify-booklist":2}],4:[function(require,module,exports){
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
            const listItem = `<li data-id=${author}><a href=#booklist> ${author} </a></li>`;
            list.push(listItem);
        });

        return new Promise( resolve => {
            resolve(list.join(''));
        });
    }

};
nav();

},{"./for-browserify-book-details":1,"./for-browserify-booklist":2}]},{},[1,2,3,4]);
