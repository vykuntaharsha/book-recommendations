import React, {Component} from 'react';
import {fetchBook} from '../services/fetch-data';
import {postVote} from '../services/post-data';
import {putBook} from '../services/put-data';
import BREditBookDetails from './BREditBookDetails';

class BRBookDetailedCard extends Component {
    constructor( props ) {
        super(props);

        this.state = {
            url : props.bookDetailsUrl,
            user : props.user,
            book : null,
            mode : 'display'
        };
        this.vote = this.vote.bind(this);
        this.edit = this.edit.bind(this);
        this.setBook = this.setBook.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            url : props.bookDetailsUrl,
            user : props.user,
            book : null
        }, () => this.obtainBook());
    }

    componentDidMount(){
        this.obtainBook();
    }

    obtainBook(){
        if(this.state.url){
            fetchBook(this.state.url)
            .then(book => this.handleBook(book));
        }
    }

    handleBook(book){
        this.setState({
            book : book,
            mode : 'display'
        });
    }

    vote( event ){
        postVote( this.state.book.isbn, this.props.user)
        .then(() => this.obtainBook());
    }

    renderVoteButtonImg(){
        const foundUser = this.state.book.votedUsers.find( user => user.id === this.state.user.id );

        if( foundUser ) return 'images/voted.svg';
        return 'images/vote.svg';
    }

    setBook(book){
        if(this.same(book)){
            this.obtainBook();
            return;
        }
        putBook( book , this.state.user )
        .then( ()=> this.obtainBook());
    }


    same(book){
        if( book.title === this.state.book.title &&
            book.genre.id === this.state.book.genre.id &&
            book.author === this.state.book.author &&
            book.description === this.state.book.description){
                return true;
            }
        return false;
    }

    edit(){
        this.setState({mode : 'edit'});
    }

    renderBook(){
        if(!this.state.book) return <section id="book-details"></section>;
        const book = this.state.book;

        function mapUsersToText( users ) {
            if(!book[users]) return ;
            return book[users].map(user => user.id ).join(',');
        }

        return (
            <section id="book-details">
                <div className="book-details" >
                    <div className="edit">
                        <ul className="edit-book">
                            <li className="edit-button"
                                onClick={this.edit}>
                                Edit
                            </li>
                        </ul>
                    </div>
                    <div className="image-holder">
                        <img className="book-image-details" src={book.image} alt="not available" />
                        <div className="vote">
                            <img
                                className="vote-button" src={this.renderVoteButtonImg()}
                                alt="vote" onClick={this.vote}/>
                            <span className="book-votes-details">
                                {book.votes}
                            </span>
                        </div>
                        <span>Voted users: {mapUsersToText('votedUsers')}</span><ul className="voted-users"></ul>

                    </div><div className="book-contents">

                        <h1 className="book-title-details title">
                            {book.title}
                        </h1>
                        <small className="title">by</small>
                        <h4 className="book-author-details title">
                            {book.author}
                        </h4>
                        <h5 className="book-isbn-details title">
                            {book.isbn}
                        </h5>
                        <h5 className="book-genre-details title">
                            {book.genre.name}
                        </h5>
                        <p className="created-users">Created users: {mapUsersToText('createdUsers')}</p>
                        <hr/>
                        <p className="book-description-details title"> {book.description} </p>
                    </div>
                </div>
            </section>
        );
    }


    render(){
        if(this.state.mode === 'display') return this.renderBook();
        if(this.state.mode === 'edit') {
            return (
                <BREditBookDetails
                    book={this.state.book}
                    setBook={this.setBook}
                />
            );
        }
    }
}

export default BRBookDetailedCard;
