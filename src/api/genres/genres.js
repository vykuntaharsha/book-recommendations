const data = require('../../../data');

module.exports = (req, res, next) =>{
    req.genres = data.genres;
    next();
};
