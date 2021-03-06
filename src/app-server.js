const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const api = require('./api');
const users = require('./users');
const bodyParser = require('body-parser');

//setting the json spacing
app.set('json spaces', 2);

//setting the app to use required modules
const staticFiles = express.static('src/client/build');

app.use(staticFiles);
app.use(bodyParser.json({
    limit : '10kb',
    extended : true
}));

app.use('/api', api);
app.use('/users', users);
app.use('/*', staticFiles);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log('use Ctrl-C to stop this server');
});
