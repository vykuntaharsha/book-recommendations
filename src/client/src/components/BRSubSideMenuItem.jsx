import React from 'react';
import {navMenuItems} from '../nav-menu-items';

const BRSubSideMenuItem = ({ name, id, filter, setBookDetailsUrl, setBookListUrl }) => {

    const nav = (filter === navMenuItems[1]) ? 'booklist' : 'book-details'

    function onClickListener() {
        if(filter === navMenuItems[1]){
            setBookListUrl(`api/books/search?q[author]=${id}`)
        }else {
            setBookDetailsUrl(`api/books/${id}`);
        }
    }

    return (
        <li data-id={id} onClick={onClickListener}>
            <a href={"#"+nav}> {name} </a>
        </li>
    );
};

export default BRSubSideMenuItem;
