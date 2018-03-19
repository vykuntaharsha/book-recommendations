import React, {Component} from 'react';
import {fetchAllGenres} from '../services/fetch-data';

class BRGenreOptions extends Component{
    constructor(props) {
        super(props);
        this.state = {
            genres : null
        };
    }

    componentDidMount(){
        this.obtainGenres();
    }

    obtainGenres(){
        fetchAllGenres()
        .then( genres => this.handleGenres(genres));
    }

    handleGenres(genres){
        this.setState( {genres : genres} )
    }

    renderGenres(){
        const list = this.state.genres.map( genre => {
                return (
                    <option key= {genre.id}
                        data-id={genre.id}
                        data-name={genre.name}
                        value={genre.id}>
                        {genre.name}
                    </option>
                );
        });
        return list;
    }

    render() {
        if( !this.state.genres ) return '';
        return this.renderGenres();
    }
}

export default BRGenreOptions;
