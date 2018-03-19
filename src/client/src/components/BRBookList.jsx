import React, {Component} from 'react';
import BRBookCard from './BRBookCard';

class BRBookList extends Component {

    getBooks(){
        const books = this.props.booklist.map( (book, index) =>
            <BRBookCard
                key={index}
                book={book}
                id={index}
                user={this.props.user}
                setBookDetailsUrl={this.props.setBookDetailsUrl}
                setLoaded={this.props.setLoaded}
            />
        );
        return books;
    }

    render(){
        return (
            <ul className="books"> {this.getBooks()} </ul>
        );
    }
}

export default BRBookList;
