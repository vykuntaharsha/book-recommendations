( () => {

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
    function addListenersToSubMenuBooks() {
        const subMenuBookList = document.querySelectorAll(".sub-side-menu >li");

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

        addListenersToSubMenuBooks();
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

})();
