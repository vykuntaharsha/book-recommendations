import React from 'react'

const BROrderBooks = ({url, setBookListUrl, setOrderBy, defaultOrderBy}) => {

    function orderListener(event) {
        const origin = new URL(document.location).origin;
        url = new URL(url, origin);

        const option = event.target.options[event.target.selectedIndex];
        if(option.value === 'votes'){
            url.searchParams.set('orderBy', '-votes');
            setOrderBy('votes');
        }else if (option.value === 'title') {
            url.searchParams.set('orderBy', 'title');
            setOrderBy('name');
        }else {
            url.searchParams.delete('orderBy')
            setOrderBy('');
        }
        setBookListUrl(url);
    }

    return (
        <div className='order-section'>
            Order:
            <select
                className='order-select'
                onChange={orderListener}
                value={defaultOrderBy}
                >
                <option value=""></option>
                <option value="title">by name</option>
                <option value="votes">by votes</option>
            </select>
        </div>
    );
};

export default BROrderBooks;
