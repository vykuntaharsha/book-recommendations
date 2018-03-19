import React, {Component} from 'react';

class BRSearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keywords : ''
        };

        this.checkEnterAndPerform = this.checkEnterAndPerform.bind(this);
        this.updateSearchKeyWords = this.updateSearchKeyWords.bind(this);
        this.search = this.search.bind(this);
    }

    checkEnterAndPerform( event ) {
        if (event.key === 'Enter') this.search();
    }

    updateSearchKeyWords( event ) {
        const keywords = event.target.value;
        this.setState({keywords : keywords});
    }

    search(event) {
        this.props.setBookListUrl(`api/books/search?q[keywords]=${this.state.keywords}`);
    }

    showSearchBar( event ) {
        if(event.target.id === 'nav-search-img'){
            document.querySelector('#nav-search-input').style.display= 'block';
        }
    }

    hideSearchBar( event ) {
        document.querySelector('#nav-search-input').style.display= 'none';
    }

    render(){
        return (
            <div id={this.props.searchId} >
                <input id={this.props.inputId}
                    placeholder="Search..."
                    onKeyPress={this.checkEnterAndPerform}
                    onChange={this.updateSearchKeyWords}
                    onMouseOut={this.hideSearchBar}
                /><img id={this.props.imgId}
                    src="images/search.png"
                    alt="search"
                    onClick={this.search}
                    onMouseEnter={this.showSearchBar}
                />
            </div>
        );
    }
}


export default BRSearchBar;
