import React, {Component} from 'react';
import {postBook} from '../services/post-data';
import BRGenreOptions from './BRGenreOptions';

class BRCreateBook extends Component{
    constructor(props) {
        super(props);

        this.defaultBook = {
            title : '',
            author : '',
            genre : {
                id: '0'
            },
            description : ''
        };

        this.state = {
            user : props.user,
            book : this.defaultBook,
            mode : 'close'
        };

        this.updateTitle = this.updateTitle.bind(this);
        this.updateAuthor = this.updateAuthor.bind(this);
        this.updateGenre = this.updateGenre.bind(this);
        this.updateDescription = this.updateDescription.bind(this);
        this.close = this.close.bind(this);
        this.create = this.create.bind(this);
    }

    componentWillReceiveProps(){
        this.changeMode();
    }

    componentDidMount(){
        this.changeMode();
    }

    changeMode(){
        this.setState({mode : 'edit'})
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

    create(){

        postBook(this.state.book, this.state.user)
        .then(message => {
            const statusSpan = document.querySelector('.create-book-status');
            statusSpan.classList.remove('hide');
            if(message === 'success'){
                statusSpan.innerHTML = "successfully created";
                statusSpan.style["background-color"] = 'green';
                this.setState({book : this.defaultBook});
            }else {
                statusSpan.innerHTML = "provide valid data";
                statusSpan.style["background-color"] = 'red';
            }
            setTimeout(()=>{
                statusSpan.classList.add('hide');
            }, 2000);
        });
    }

    close(){
        this.setState({ mode : 'close'});
        this.props.renderCreateBook( false );
    }


    render(){
        if(this.state.mode === 'close') return <section id="create-book"></section>;
        return (
            <section id="create-book">
                <div className='close'>
                    <button
                        className="create-book-close"
                        onClick={this.close}>
                        close
                    </button>
                </div>
                <p className="create-book-status"></p>
                <p className="create-header">Create your own book </p>
                Title*:
                <input
                    className="book-title-input"
                    value={this.state.book.title}
                    placeholder="Enter Book Title"
                    type="Text"
                    onChange={this.updateTitle}
                    required={true}
                />
                Author:
                <input
                    className="book-author-input"
                    value={this.state.book.author}
                    placeholder="Enter Book Author"
                    type="Text"
                    onChange={this.updateAuthor}
                />
                Genre*:
                <select
                    className="book-genre-input"
                    onChange={this.updateGenre}
                    required={true}>
                    <option></option>
                    <BRGenreOptions />
                </select>
                Description:
                <textarea
                    className="book-description-input"
                    value={this.state.book.description}
                    placeholder="Enter book description"
                    onChange={this.updateDescription}>

                </textarea>
                <div className="create-button">
                    <button
                        className="book-create-button"
                        onClick={this.create}>
                        Create
                    </button>
                </div>
            </section>
        );
    }
}

export default BRCreateBook;
