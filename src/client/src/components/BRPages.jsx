import React from 'react';

const BRPages = ({renderPage, currentPage, maxPages}) => {

    function renderButton( pageNo ) {
        if( pageNo === currentPage ){
            return <li
                key={pageNo}
                className="page active"
                pageno={pageNo}
                onClick={pageButtonListener}>
                <a href="#booklist" pageno={pageNo}> {pageNo} </a>
            </li>;
        }
        return <li
            key = {pageNo}
            className="page"
            pageno={pageNo}
            onClick={pageButtonListener}>
            <a href="#booklist" pageno={pageNo}> {pageNo} </a>
        </li>;
    }

    function pageButtonListener( event ) {
        const pageNo = parseInt(event.target.getAttribute('pageno'), 10);
        renderPage( pageNo );
    }

    function renderPageButtons( page ) {
        if( !page ) page = 1;
        if( page < 1) page = 1;
        if( page > maxPages) page = maxPages;

        const rangeStart = (page - 1 > 3) ? page - 2 : 2;
        const rangeEnd = (maxPages - page > 3) ? page+2 : maxPages-1;

        let pageButtons = []
        pageButtons.push(renderButton(1));

        if( rangeStart !== 2 ) pageButtons.push('...');

        for (let i = rangeStart; i <= rangeEnd; i++) {
            pageButtons.push(renderButton(i))
        }

        if( rangeEnd !== maxPages-1 ) pageButtons.push('...');
        if(maxPages !== 1) pageButtons.push(renderButton(maxPages));

        return pageButtons;
    }

    function previousPageListener() {
        if(currentPage !== 1) renderPage( currentPage - 1 );
    }

    function nextPageListener() {
        if(currentPage !== maxPages) renderPage( currentPage + 1 );
    }

    function previouPageClasses() {
        if(currentPage === 1) return "previous-page disabled";
        return "previous-page";
    }

    function nextPageClasses() {
        if(currentPage === maxPages) return "next-page disabled";
        return "next-page";
    }

    return (
        <ul className="pages">
            <li
                className={previouPageClasses()}
                onClick={previousPageListener}>
                <a href="#booklist"> {'<<'} </a>
            </li>
                {renderPageButtons(currentPage)}
            <li
                className={nextPageClasses()}
                onClick={nextPageListener}>
                <a href="#booklist"> {'>>'} </a>
            </li>
        </ul>

    );

};

export default BRPages;
