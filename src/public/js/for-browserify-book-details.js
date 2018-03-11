const renderBookDetails = (url) => {

    const book = {}

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
        postVoteDataToServer( url+'/vote', { user : user});
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

        putBookDetailsToSever( url, {book : book})
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

        })
        .then( () => {
            setBookDetails();
            return getVotedUsers( url+'/voted-users' );
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
        document.querySelector('.book-title-details').innerHTML = book.title;
        document.querySelector('.book-image-details').src = book.image;
        document.querySelector('.book-isbn-details').innerHTML = book.isbn;
        document.querySelector('.book-author-details').innerHTML = book.author;
        document.querySelector('.book-genre-details').innerHTML = book.genre.name;
        document.querySelector('.book-votes-details').innerHTML = book.votes;
        document.querySelector('.book-description-details').innerHTML = book.description;
    }

    addListenersToComponents();
    renderBookDescription();
    //fetches the book details from provided url
    function getBookDetailsFromServer( url ) {
        return fetch(url)
            .then(res => res.json())
            .then(data => data.book );
    }



}

function getVotedUsers( url ) {
    return fetch(url)
        .then(res => res.json())
        .then(data => data.users );
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
