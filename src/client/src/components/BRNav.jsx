import React from 'react';
import BRNavMenuItem from './BRNavMenuItem';
import BRSearchBar from './BRSearchBar';
import {navMenuItems} from '../nav-menu-items';

const BRNav = ({ setFilter, setBookListUrl , renderCreateBook}) => {

    const menuItems = navMenuItems.map( (item, index) =>
        <BRNavMenuItem
            key={index}
            title={item}
            setFilter={setFilter}
            renderCreateBook={renderCreateBook}
        />
    );

    return (
            <nav className="nav-text">
                <a className="nav-logo"><img src="images/logo.png" alt="logo" /></a>
                <ul className="main-menu">
                    {menuItems}
                    <BRSearchBar
                        searchId="nav-search"
                        inputId="nav-search-input"
                        imgId="nav-search-img"
                        setBookListUrl={setBookListUrl}
                    />
                </ul>
            </nav>
    );
};

export default BRNav;
