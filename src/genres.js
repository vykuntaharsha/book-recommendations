const fileService = require('fs');

const genreRawData = fileService.readFileSync('data/genres-data.csv', 'utf8');
const genres = [];

genreRawData.split(/\n/).map( line => {
    const words = line.replace(/["]+/g,'').split(/,/);
    const genre = {};
    genre.id = parseInt(words[0],10);
    genre.name = words[1];
    genres.push(genre);
});

module.exports = genres;
