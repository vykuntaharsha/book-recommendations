const postDataToServer = (url, data) => {
    return fetch(url , {
        body: JSON.stringify(data),
        method: 'POST',
        mode: 'cors',
        headers: {
            'content-type': 'application/json'
        },
    });
}

export const postVote = (id, user) => {
    return postDataToServer(`api/books/${id}/vote`, {user : user})
            .then( res => res.status === 204 ? 'success' : Promise.reject('unable to post vote'))
            .catch( error => console.log(error));
};

export const postBook = (book, user) => {
    return postDataToServer(`api/books/book`, {user: user, book: book})
            .then(res => res.status=== 204 ? 'success' : Promise.reject('unable to post book'))
            .catch( error => console.log(error));
}
