const constants = require('../constants');

function sortData( data, parameter, descending) {
    data = data.slice(0);
    data.sort((a,b) => {
        if(a[parameter] > b[parameter]){
            return 1;
        }else if (a[parameter] < b[parameter]) {
            return -1;
        }
        return 0;
    });

    if(descending === true){
        data.reverse();
    }
    return data;
}

module.exports = (req, res, next) => {

    const orderBy = constants.PARAMETERS_OF_ORDER_BY.find( parameter => parameter === req.query.orderBy);

    if( orderBy ){
        if(orderBy.includes('-')){
            req.books = sortData( req.books, orderBy.substr(1), true);
        }else {
            req.books = sortData( req.books, orderBy);
        }
    }

    if(!orderBy && req.query.orderBy){
        res.sendStatus(400);
    }else {
        next();
    }


};
