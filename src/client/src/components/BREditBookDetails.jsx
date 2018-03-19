import React, {Component} from 'react';
import BRGenreOptions from './BRGenreOptions';

class BREditBookDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
            book : Object.assign({},props.book)
        };

        this.reset = this.reset.bind(this);
        this.save = this.save.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.updateGenre = this.updateGenre.bind(this);
        this.updateAuthor = this.updateAuthor.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
    }

    reset() {

        this.handleBook(Object.assign({}, this.props.book));
    }

    save() {
        this.props.setBook( this.state.book );
    }

    handleBook( book ){
        this.setState({ book : book });
    }

    updateTitle(event) {
        const book = this.state.book;
        book.title = event.target.value;

        this.handleBook(book);
    }

    updateAuthor(event) {
        const book = this.state.book;
        book.author = event.target.value;

        this.handleBook(book);
    }

    updateDescription(event) {
        const book = this.state.book;
        book.description = event.target.value;

        this.handleBook(book);
    }

    updateGenre( event ) {
        const book = this.state.book;
        const genre = {}
        const genreElement = event.target;
        const genreOption = genreElement.options[genreElement.selectedIndex];

        genre.id = genreOption.getAttribute('data-id');
        genre.name = genreOption.getAttribute('data-name');

        book.genre = genre;

        this.handleBook(book);
    }

    render(){
        if(!this.state.book) return <section id="book-details"> Loading...</section>;

        return (
            <section id="book-details">
                <div className="book-details" >
                    <div className="edit">
                        <ul className="edit-book">
                            <li className="reset-button"
                                onClick={this.reset}>
                                Reset
                            </li>
                            <li className="save-button"
                                onClick={this.save}>
                                Save
                            </li>
                        </ul>
                    </div>
                    <div className="image-holder">
                        <img className="book-image-details" src={this.state.book.image} alt="not available" />

                    </div><div className="book-contents">

                        <input
                            className="book-title-details title"
                            onChange={this.updateTitle}
                            value={this.state.book.title}
                        />
                        <small className="title">by</small>
                        <input
                            className="book-author-details title"
                            onChange={this.updateAuthor}
                            value={this.state.book.author}
                        />

                        <h5 className="book-isbn-details title">
                            {this.state.book.isbn}
                        </h5>

                        <select
                            className="book-genre-details title"
                            onChange={this.updateGenre}
                            value={this.state.book.genre.id}>
                            <BRGenreOptions />
                        </select>

                        <textarea
                            className="book-description-details title edit-description"
                            value={this.state.book.description}
                            onChange={this.updateDescription}>
                        </textarea>
                    </div>
                </div>
            </section>
        );
    }

}

export default BREditBookDetails;
