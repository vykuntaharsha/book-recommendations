const genres = require('../../../data').genres;
const constants = require('../constants');

module.exports = (req, res) => {
    //parsing url
    const maxResults = parseInt(req.query.maxResults) || constants.DEFAULT_MAX_RESULTS;

    const startIndex = parseInt(req.query.startIndex) || constants.DEFAULT_START_INDEX;

    let all = false;

    if(req.query.all === 'true'){
        all = true;
    }

    //getting reuested genres
    let genresRequested;

    if( all ){
        genresRequested = genres.slice( startIndex);
    }else {
        genresRequested = genres.slice( startIndex, startIndex + maxResults);
    }

    //sending response
    if(genresRequested){
        res.status(200).json({
            noOfGenres : genresRequested.length,
            gneres : genresRequested
        });
    }else {
        res.status(404).send(constants.PAGE_NOT_FOUND);
    }

};
