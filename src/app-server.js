const express = require('express');
const app = express();
const PORT = 3000;

const genres = require('./genres');
const books = require('./books');

app.use(express.static('src/public'));
app.set('json spaces', 2);

app.get('/api/genres', (req,res) =>{
    const noOfGenres = req.query.total || genres.length;
    res.json(genres.slice(0,noOfGenres));

});

app.get('/api/books', (req,res) =>{
    let noOfBooks = req.query.maxResults || 20;
    if(noOfBooks > 40){
        noOfBooks = 40;
    }
    res.json(books.slice(0,noOfBooks));

});

app.get('/api/books', (req,res) => {
    const isbn = req.query.isbn;
    res.json(books.filter(book => book.isbn === isbn )[0]);
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log('use Ctrl-C to stop this server');
});
