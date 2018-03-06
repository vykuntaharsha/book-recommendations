const data = require('../../../data');
const constants = require('../constants');

module.exports = (req, res) =>{

    const id = req.params.id;

    const book = data.books.find( book => book.isbn === id);

    if( book ){
        res.status(200).json({
            noOfUsers : book.votedUsers.length,
            users : book.votedUsers
        });
    }else {
        res.status(404).send(constants.PAGE_NOT_FOUND);
    }
};
