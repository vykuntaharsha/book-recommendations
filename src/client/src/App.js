import React, { Component } from 'react';

import './css/index.css';
import './css/nav.css';
import './css/create-book.css';
import './css/books.css';
import './css/book-details.css';

import BRWelcomeUserSpan from './components/BRWelcomeUserSpan';
import BRNav from './components/BRNav';
import BRSideNavBar from './components/BRSideNavBar';
import BRSearchBar from './components/BRSearchBar';
import BRSlideShow from './components/BRSlideShow';
import BRBookListPages from './components/BRBookListPages';
import BRBookDetailedCard from './components/BRBookDetailedCard';
import BRCreateBook from './components/BRCreateBook';
import BRFooter from './components/BRFooter';

import {fetchUser} from './services/fetch-data';

class App extends Component {

    constructor(props){
        super(props);
        this.state ={
            bookListUrl : 'api/books',
            bookDetailsUrl : null,
            filter : null,
            user : null,
            create : false,
            loaded : false
        };
        this.bookListSection = this.getBookListSection();
        this.sideNavBarSection = this.getSideNavBarSection();
        this.bookDetailsSection = this.getBookDetailsSection();
        this.setBookListUrl = this.setBookListUrl.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.setBookDetailsUrl = this.setBookDetailsUrl.bind(this);
        this.renderCreateBook = this.renderCreateBook.bind(this);
        this.setLoaded = this.setLoaded.bind(this);
    }

    componentDidMount(){
        this.obtainUser();
    }

    obtainUser(){
        fetchUser()
        .then(user => this.setUser(user));
    }

    setUser( user ){
        this.refreshContent(user);
        this.setState({user : user});
    }

    refreshContent( user ){
        this.bookListSection = this.getBookListSection(null, user);
        this.sideNavBarSection = this.getSideNavBarSection();
        this.bookDetailsSection = this.getBookDetailsSection(null, user);
    }

    setBookListUrl( url ){
        this.bookListSection = this.getBookListSection( url );
        this.setState({
            bookListUrl : url
        });
    }

    setFilter( filter ){
        this.sideNavBarSection = this.getSideNavBarSection( filter );
        this.setState({
            filter : filter
        });
    }

    setBookDetailsUrl( url ){
        this.bookDetailsSection = this.getBookDetailsSection( url );
        this.setState({
            bookDetailsUrl : url
        });
    }

    getBookListSection( url, user ){
        if(!url) url = this.state.bookListUrl;
        if(!user) user = this.state.user;
        return (
            <BRBookListPages
                bookListUrl={url}
                user={user}
                setBookDetailsUrl={this.setBookDetailsUrl}
                setBookListUrl={this.setBookListUrl}
                setLoaded={this.setLoaded}
            />
        );
    }

    getBookDetailsSection( url, user ){
        if(!url) url = this.state.bookDetailsUrl;
        if(!user) user = this.state.user;
        return (
            <BRBookDetailedCard
                bookDetailsUrl={ url}
                setLoaded={this.setLoaded}
                user={user}/>
        );
    }

    getSideNavBarSection( filter ){
        if(!filter) filter = this.state.filter;
        return (
            <BRSideNavBar
                filter={ filter}
                setBookListUrl={this.setBookListUrl}
                setBookDetailsUrl={this.setBookDetailsUrl}
            />
        );
    }

    renderCreateBook( flag=true ){
        this.setState({create : flag});
    }

    getCreateBookSection(){
        if(this.state.create) {
            return (
                <BRCreateBook
                    user={this.state.user}
                    renderCreateBook={this.renderCreateBook}
                />
            );
        }
        return '';
    }

    setLoaded(flag){
        this.setState({loaded : flag});
    }
    render() {
        if(!this.state.user) return <h1> Loading... </h1>;
        return (
            <div className="App">
                <header>
                    <BRNav
                        setFilter={this.setFilter}
                        setBookListUrl={this.setBookListUrl}
                        renderCreateBook={this.renderCreateBook}
                    />
                    <BRWelcomeUserSpan user={this.state.user}/>
                </header>
                <main>
                    <BRSlideShow/>
                    <div className="search-container">
                        <BRSearchBar
                            searchId="main-search"
                            inputId="main-search-input"
                            imgId="main-search-img"
                            setBookListUrl={this.setBookListUrl}
                        />
                      </div>
                </main>
                {this.getSideNavBarSection()}
                {this.getBookListSection()}
                {this.getBookDetailsSection()}
                {this.getCreateBookSection()}
                <BRFooter/>
            </div>
        );
    }
}

export default App;
