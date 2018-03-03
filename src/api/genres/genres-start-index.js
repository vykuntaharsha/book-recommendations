const constants = require('../constants');

module.exports = (req, res, next) => {

    const startIndex = parseInt(req.query.startIndex) || constants.DEFAULT_START_INDEX;

    req.genres = req.genres.slice(startIndex);
    if(req.query.all==='true'){
        res.status(200).json({
            noOfGenres : req.genres.length,
            genres : req.genres
        });
    }else if (req.query.all) {
        res.sendStatus(400);
    }else {
        next();
    }
};
