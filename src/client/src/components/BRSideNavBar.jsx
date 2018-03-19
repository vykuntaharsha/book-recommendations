import React, {Component} from 'react';
import BRSubSideMenu from './BRSubSideMenu';
import {fetchAllGenres} from '../services/fetch-data';
import {navMenuItems} from '../nav-menu-items';

class BRSideNavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filter : props.filter,
            items : null
        };
        this.menuItemListener = this.menuItemListener.bind(this);
    }

    componentWillReceiveProps(props){
        this.setState({
            filter : props.filter
        }, () => this.obtainMenuItems());
    }

    componentDidMount(){
        this.obtainMenuItems();
    }

    obtainMenuItems() {

        switch (this.state.filter) {
            case navMenuItems[0]:
                this.obtainGenres();
                break;
            case navMenuItems[1]:
                this.obtainsAlphabets();
                break;
            case navMenuItems[2]:
                this.obtainsAlphabets();
                break;
            case navMenuItems[3]:
                this.obtainGenres();
                break;
            default:
                break;
        }
    }

    obtainGenres(){
        fetchAllGenres()
        .then( genres => {
            const items = genres.map( genre => {
                return (
                    <li key={genre.id}>
                        <span
                            data-id={genre.id}
                            className="menu-item"
                            onClick={this.menuItemListener}>
                            {genre.name}
                        </span>
                        <BRSubSideMenu
                            filter={this.state.filter}
                            dataId={genre.id}
                            setBookListUrl={this.props.setBookListUrl}
                            setBookDetailsUrl={this.props.setBookDetailsUrl}
                        />
                    </li>
                );
            });

            this.handleItems(items);
        });
    }

    obtainsAlphabets(){
        const items = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map( alphabet => {
            return (
                <li key={alphabet}>
                    <span
                        data-id={alphabet}
                        className="menu-item"
                        onClick={this.menuItemListener}>
                        {alphabet}
                    </span>
                    <BRSubSideMenu
                        filter={this.state.filter}
                        dataId={alphabet}
                        setBookListUrl={this.props.setBookListUrl}
                        setBookDetailsUrl={this.props.setBookDetailsUrl}
                    />
                </li>
            );
        });

        this.handleItems(items);

    }

    handleItems(items){
        this.setState({items : items});
    }

    menuItemListener( event ){
        const target = event.target.parentElement.childNodes[1];

        if (window.getComputedStyle(target, 'style').display==='none') {
            target.setAttribute('style', 'display:block');
        } else {
            target.setAttribute('style', 'display:none');
        }

        this.handleListener( event );
    }

    handleListener( event ){
        let url = null;
        const id = event.target.getAttribute('data-id');

        switch (this.state.filter) {
            case navMenuItems[0]:
                url = `api/genres/${id}/books`
                break;
            case navMenuItems[1]:
                url = `api/books?startsWith[author]=${id}`
                break;
            case navMenuItems[2]:
                url = `api/books?startsWith[title]=${id}`
                break;
            case navMenuItems[3]:
                url = `api/genres/${id}/books?orderBy=-votes`
                break;
            default:
                url = `api/books`
                break;
        }
        this.props.setBookListUrl(url);
    }

    render(){
        if(!this.state.items) return <section id="sidebar"></section>;
        return (
            <section id="sidebar">
                <div>
                    <ul className="side-menu">
                        {this.state.items}
                    </ul>
                </div>
            </section>
        );
    }
}


export default BRSideNavBar;
