import React, {Component} from 'react';
import BRSubSideMenuItem from './BRSubSideMenuItem';

import {fetchBooksOf, fetchPopularBooksOf, fetchBooksByTitleStartingAlphabet, fetchBooksByAuthorStartingAlphabet} from '../services/fetch-data';
import {navMenuItems} from '../nav-menu-items';

class BRSubSideMenu extends Component {
    constructor(props) {
        super(props);
        this.state ={
            dataId : props.dataId,
            filter : props.filter,
            items : null
        };
    }

    componentWillReceiveProps(props){
        this.setState({
            filter : props.filter,
            dataId : props.dataId
        }, () => this.obtainSubSideMenuData());
    }

    componentDidMount(){
        this.obtainSubSideMenuData();
    }

    obtainSubSideMenuData(){
        switch (this.state.filter) {
            case navMenuItems[0]:
                this.obatainGenreBooks( fetchBooksOf );
                break;
            case navMenuItems[1]:
                this.obtainAuthorBooks();
                break;
            case navMenuItems[2]:
                this.obtainBooksByTitle();
                break;
            case navMenuItems[3]:
                this.obatainGenreBooks( fetchPopularBooksOf );
                break;
            default:
                break;
        }
    }

    obtainBooksByTitle(){
        fetchBooksByTitleStartingAlphabet(this.state.dataId)
        .then(books => this.handleBooks(books));
    }

    obtainAuthorBooks(){
        fetchBooksByAuthorStartingAlphabet(this.state.dataId)
        .then(books => this.handleAuthors(books));
    }

    obatainGenreBooks( fetchBooks ) {
        fetchBooks(this.state.dataId)
        .then(books => this.handleBooks(books));
    }

    handleItems( items ){
        this.setState({items : items});
    }

    handleAuthors( books ){
        const authors = new Set()

        books.forEach( book => {
            authors.add(book.author);
        });
        const items = [];

        authors.forEach( (author, index) => {
            const name = author.length < 20 ? author : author.substr(0,18).trim() + '...';

            const item = <BRSubSideMenuItem
                                key={index}
                                name={name}
                                id={author}
                                filter={this.state.filter}
                                setBookListUrl={this.props.setBookListUrl}
                                setBookDetailsUrl={this.props.setBookDetailsUrl}
                        />
            items.push(item);
        });

        this.handleItems(items);
    }

    handleBooks( books ) {
        const items = books.map( (book, index) => {

            const name = book.title.length < 20 ? book.title : book.title.substr(0,18).trim() + '...';

            const item = <BRSubSideMenuItem
                                key={index}
                                name={name}
                                id={book.isbn}
                                filter={this.state.filter}
                                setBookListUrl={this.props.setBookListUrl}
                                setBookDetailsUrl={this.props.setBookDetailsUrl}
                        />

            return item;
        });
        this.handleItems(items);
    }


    bookOnClickListener( event ) {
        this.props.setBookDetailsUrl()
    }

    render(){
        if(!this.state.items) return '';
        return (
            <ul className="sub-side-menu">
                {this.state.items}
            </ul>
        );
    }
}

export default BRSubSideMenu;
