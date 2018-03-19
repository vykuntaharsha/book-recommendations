import React, {Component} from 'react';
import BRBookList from './BRBookList';
import BRPages from './BRPages';
import BROrderBooks from './BROrderBooks';

import {fetchBooksFromServer, fetchMaxAvaliableBooks} from '../services/fetch-data';

class BRBookListPages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user : props.user,
            books : null,

        };
        this.orderBy = '';
        this.noOfBooksPerPage = 8;
        this.url = props.bookListUrl;
        this.currentPage = 1;
        this.maxPages = 1;
        this.renderPage = this.renderPage.bind(this);
        this.setOrderBy = this.setOrderBy.bind(this);
    }

    componentWillReceiveProps(props){
        this.url = props.bookListUrl;
        this.setState({
            user : props.user,
            books : null
        }, () => this.obtainBooks());
    }


    obtainBooks(){
        fetchMaxAvaliableBooks( this.url )
        .then( count => {
            this.maxPages = Math.ceil( count/ this.noOfBooksPerPage);
            this.setPageData();
        })
        .then( () => this.updateBooks());
    }

    componentDidMount(){
        this.obtainBooks();
    }

    updateBooks(){
        fetchBooksFromServer(this.url)
        .then(books => this.handleBooks(books));
    }

    handleBooks(books){
        this.setState({
            books : books
        });
    }

    setPageData( page ) {
        if( !page ) page = 1;
        if( page < 1) page = 1;
        if( page > this.maxPages) page = this.maxPages;

        const startIndex = (page - 1) * this.noOfBooksPerPage;

        const origin = new URL(document.location).origin;
        const url = new URL(this.url, origin);

        url.searchParams.set('startIndex', startIndex);
        url.searchParams.set('maxResults', this.noOfBooksPerPage);

        this.currentPage = page;
        this.url = url;
    }

    renderPage( page ){
        this.setPageData( page );
        this.updateBooks();
    }

    setOrderBy( option ){
        this.orderBy = option;
    }

    render(){
        if(!this.state.books) return <section id="booklist"> Loading... </section>;
        return (
            <section id="booklist">
                <BROrderBooks
                    url={this.url}
                    setBookListUrl={this.props.setBookListUrl}
                    setOrderBy={this.setOrderBy}
                    defaultOrderBy={this.orderBy}
                />
                <BRBookList
                    booklist={this.state.books}
                    user={this.state.user}
                    setBookDetailsUrl={this.props.setBookDetailsUrl}
                />
                <div className="book-list-pages">
                    <BRPages
                        renderPage={this.renderPage}
                        currentPage={this.currentPage}
                        maxPages={this.maxPages}/>
                </div>
            </section>
        );
    }
}

export default BRBookListPages;
