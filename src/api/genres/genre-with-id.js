const data = require('../../../data');
const constants = require('../constants');

module.exports = (req, res) => {
    const id = req.params.id;

    const genre = data.genres.find( genre => genre.id === id);

    if(genre){
        res.status(200).json({genre});
    }else {
        res.status(404).send(constants.PAGE_NOT_FOUND);
    }

};
