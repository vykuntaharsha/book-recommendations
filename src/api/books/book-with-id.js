const books = require('../../../data').books;
const constants = require('../constants');


module.exports = (req, res) => {
    const id = req.params.id;

    const book = books.find( book => book.isbn === id);

    if(book){
        res.status(200).json({book});
    }else {
        res.status(404).send(constants.PAGE_NOT_FOUND);
    }
};
