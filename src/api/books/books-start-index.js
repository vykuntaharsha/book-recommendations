const constants = require('../constants');

module.exports = (req, res, next) => {

    const startIndex = parseInt(req.query.startIndex) || constants.DEFAULT_START_INDEX;

    req.books = req.books.slice( startIndex );

     if(req.query.all === 'true'){
         res.status(200).json({
             noOfBooks : req.books.length,
             maxAvailableBooks : req.books.length,
             books : req.books
         });
     }else if (req.query.all) {
         res.sendStatus(400);
     }else {
         next();
     }
};
