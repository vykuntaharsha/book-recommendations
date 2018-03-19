import React, {Component} from 'react';
import {postVote} from '../services/post-data';
import {fetchBookById} from '../services/fetch-data';

class BRBookCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            book : props.book,
            id : props.id,
            user : props.user
        }
        this.vote = this.vote.bind(this);
        this.renderBookDetails = this.renderBookDetails.bind(this);
    }

    componentWillReceiveProps( props ){
        this.setState({
            book : props.book,
            id : props.id,
            user : props.user
        });
    }

    componentDidMount(){
        this.obtainBook();
    }

    obtainBook(){
        fetchBookById(this.state.book.isbn)
        .then( book => this.handleBook(book));
    }

    handleBook(book){
        this.setState({book: book});
    }

    vote( event ){
        postVote( this.state.book.isbn, this.props.user)
        .then(() => {
            this.props.setLoaded(true);
            this.obtainBook();
        });
    }

    renderBookDetails(){
        this.props.setBookDetailsUrl(`api/books/${this.state.book.isbn}`);
    }

    renderVoteButtonName(){
        const foundUser = this.state.book.votedUsers.find( user => user.id === this.state.user.id );

        if( foundUser ) return 'Cancel';
        return 'Vote';
    }

    render(){
        if(!this.state.book) return <li>Loading...</li>;
        const book = this.state.book;
        const id = this.state.id;
        const title = book.title.length < 50 ? book.title : book.title.substr(0,47).trim()+'...';

        let author = book.author ? book.author : "unknown";

        author = author.length < 30 ? author : author.substr(0,27).trim()+'...';
        return (
            <li id={"book-"+id} className="book" data-id={book.isbn}>
                <a href="#book-details">
                    <img
                        className={"book-img book-img-"+id}
                        src={book.image}
                        alt="not available"
                        onClick={this.renderBookDetails}
                    />
                </a>
                <p className={"book-title book-title-"+id}>{title}</p>
                <p className={"book-author book-author-"+id}>{author}</p>
                <div className="like">
                    <button className="button-like" onClick={this.vote}>{this.renderVoteButtonName()}</button><p className={"book-vote book-vote-"+id}>{book.votes}</p>
                </div>
            </li>
        );
    }
}

export default BRBookCard;
