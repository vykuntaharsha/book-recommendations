const constants = require('../constants');

module.exports = (req, res) => {

    const maxResults = parseInt(req.query.maxResults) || constants.DEFAULT_MAX_RESULTS;

    req.genres = req.genres.slice(0, maxResults);

    if(req.genres){
        res.status(200).json({
            noOfGenres : req.genres.length,
            gneres : req.genres
        });
    }else {
        res.sendStatus(400);
    }

};
