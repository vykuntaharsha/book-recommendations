const renderBookDetails = (url) => {

    const book = {}

    function addListenersToComponents() {
        //adding listeners to the components
        document.querySelector('.vote-button').addEventListener('click', voteToggle);
        document.querySelector('.voted-button').addEventListener('click', voteToggle);
        document.querySelector('.edit-button').addEventListener('click', renderToEdit);
        document.querySelector('.reset-button').addEventListener('click', renderToEdit);
        document.querySelector('.save-button').addEventListener('click', saveBookDetails);
    }

    function voteToggle(event) {
        //toggling the vote and voted buttons
        if(event.target.classList.contains('vote-button')){
            event.target.classList.add('hide');
            document.querySelector('.voted-button').classList.remove('hide');
            book.votes += 1;
        }else {
            event.target.classList.add('hide');
            document.querySelector('.vote-button').classList.remove('hide');
            book.votes -= 1;
        }
        renderBookDescription(book);
    }

    function renderToEdit() {
        // rendering the section to enable editing
        document.querySelector('.edit-button').classList.add('hide');
        document.querySelector('.reset-button').classList.remove('hide');
        document.querySelector('.save-button').classList.remove('hide');

        document.querySelector('.book-title-details').outerHTML = `<input class="book-title-details title" type="text" value="${book.title}">`;

        document.querySelector('.book-author-details').outerHTML = `<input class="book-author-details title" type="text" value="${book.author}">`;

        document.querySelector('.book-genre-details').outerHTML = `<input class="book-genre-details title" type="text" value="${book.genre}">`;

        document.querySelector('.book-description-details').outerHTML = `<div class="book-description-details title edit-description" contenteditable="true">${book.description}</div>`;
    }

    function saveBookDetails() {
        // saving the book details
        book.title = document.querySelector('.book-title-details').value;
        book.author = document.querySelector('.book-author-details').value;
        book.genre = document.querySelector('.book-genre-details').value;
        book.description = document.querySelector('.book-description-details').innerHTML;

        renderSavedBookData();
        renderBookDescription(book);
        //posting data still to be implemented
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
        // rendering the book description
        document.querySelector('.book-title-details').innerHTML = book.title;
        document.querySelector('.book-image-details').src = book.image;
        document.querySelector('.book-isbn-details').innerHTML = book.isbn;
        document.querySelector('.book-author-details').innerHTML = book.author;
        document.querySelector('.book-genre-details').innerHTML = book.genre;
        document.querySelector('.book-votes-details').innerHTML = book.votes;
        document.querySelector('.book-description-details').innerHTML = book.description;

    }

    addListenersToComponents();

    //fetches the book details from provided url
    fetch(url)
        .then(res => res.json())
        .then(data => {
            book.title = data.title;
            book.image = data.image;
            book.isbn = data.isbn;
            book.author = data.author;
            book.genre = data.genre.name;
            book.votes = data.votes;
            book.description = data.description;
            renderBookDescription();
        })
        .catch(error => console.log('error in book-data parsing' + error));

}

//exporting for browserify
module.exports = {
    renderBookDetails : renderBookDetails
};
