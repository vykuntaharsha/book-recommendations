const data = require('../../../data');
const isValidBookData = require('../validation').isValidBookData;
const isValidUser = require('../validation').isValidUser;

const generateUniqueId = () => {

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let uniqueId = '';

    for (let i = 8; i > 0; --i) {
        uniqueId += chars[Math.floor(Math.random() * chars.length)];
    }

    const foundId = data.books.find( book => book.isbn === uniqueId );

    if( foundId ) return getUniqueId();
    return uniqueId;
};

module.exports = (req, res) => {

    const book = req.body.book || null;
    const user = req.body.user || null;

    if( isValidBookData(book) && isValidUser(user) ){

        if(!book.author) book.author = '';
        if(!book.image) book.image = 'images/default.png';
        if(!book.description ) book.description = '';
        book.isbn = generateUniqueId();
        book.createdUsers = [ user ];
        book.votedUsers = [];
        book.votes = 0;

        data.books.push( book );
        res.sendStatus( 204 );
    }else {
        res.sendStatus(400);
    }

};
