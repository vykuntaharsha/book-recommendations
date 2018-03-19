import React from 'react';
import {navMenuItems} from '../nav-menu-items';
const BRNavMenuItem = ({ title, setFilter , renderCreateBook}) => {

    function updateFilter() {
        setFilter(title);
    }

    if(title === navMenuItems[4]){
        return (
            <li onClick={renderCreateBook}>
                <a id={"nav-"+title} href="#create-book"> {title}</a>
            </li>
        );
    }

    return (
        <li onClick={updateFilter}>
            <a id={"nav-"+title} href="#sidebar"> {title}</a>
        </li>
    );
};

export default BRNavMenuItem;
