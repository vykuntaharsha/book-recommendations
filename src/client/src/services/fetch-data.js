export const fetchDataFromServer = (url) =>{
    return fetch( url )
            .then(res => res.ok ? res.json() : Promise.reject(`unable to get data from ${url}`))
            .catch(error => console.log(error));
};

export const fetchAllGenres = () => {

    return fetchDataFromServer('api/genres?all=true')
            .then(data => data.genres ? data.genres : Promise.reject(`unable to get genres`))
            .catch(error => console.log(error));
};

export const fetchBooksOf = ( id ) => {
    return fetchDataFromServer(`api/genres/${id}/books`)
            .then( data => data.books ? data.books : Promise.reject(`unable to get books of genre ${id}`))
            .catch(error => console.log(error));
};

export const fetchPopularBooksOf = ( id ) => {
    return fetchDataFromServer(`api/genres/${id}/books?orderBy=-votes`)
            .then( data => data.books ? data.books : Promise.reject(`unable to get books of genre: ${id}`))
            .catch(error => console.log(error));
};

export const fetchBooksFromServer = ( url ) => {
    return fetchDataFromServer(url)
            .then(data => data.books ? data.books : Promise.reject(`unable to get books from ${url}`))
            .catch(error => console.log(error));
};

export const fetchUser = () => {
    return fetch('users',{
        method : 'POST'
    })
    .then(res => res.ok ? res.json() : Promise.reject('unable to get user'))
    .catch(error => console.log(error))
    .then(data => data.user);
};

export const fetchMaxAvaliableBooks = (url) => {
    return fetchDataFromServer( url )
            .then( data => data.maxAvailableBooks ? data.maxAvailableBooks : Promise.reject(`unable to get maxAvailableBooks from ${url}`))
            .catch(error => console.log(error));
};

export const fetchBookById = (id) => {
    return fetchDataFromServer(`api/books/${id}`)
            .then(data => data.book ? data.book : Promise.reject(`unable to book of id ${id}`))
            .catch(error => console.log(error));
}

export const fetchBook = (url) => {
    return fetchDataFromServer(url)
            .then(data => data.book ? data.book : Promise.reject(`unable to get ${url}`))
            .catch(error => console.log(error));
}

export const fetchBooksByAuthorStartingAlphabet = (alphabet) => {
    return fetchDataFromServer(`api/books?startsWith[author]=${alphabet}`)
            .then(data => data.books ? data.books : Promise.reject(`unable to get books by author's statrting letter ${alphabet}`))
            .catch(error => console.log(error));
};

export const fetchBooksByTitleStartingAlphabet = (alphabet) => {
    return fetchDataFromServer(`api/books?startsWith[title]=${alphabet}`)
            .then(data => data.books ? data.books : Promise.reject(`unable to get books by title statrting letter ${alphabet}`))
            .catch(error => console.log(error));
};
