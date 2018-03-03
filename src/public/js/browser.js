(() => {
    const getUrl = () => {
        return '../../api/books';
    };

    const callGetJsonService = (url) => {
        return fetch(url)
        .then(r => {
            return r.json();
        });
    };

    const performGetRequest = () => {
        const url = getUrl();
        callGetJsonService(url)
        .then(json => {
            console.log(json);
        });
    };

    performGetRequest();
})();