const putData = ( url, data) => {
    return fetch(url, {
        method : 'PUT',
        body : JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        },
    });

};

export const putBook = ( book, user ) => {
    return putData(`api/books/${book.isbn}`, {book : book, user : user})
            .then(res => res.status === 204 ? null : Promise.reject('unable to put data to server'))
            .catch(error => console.log(error));
}
