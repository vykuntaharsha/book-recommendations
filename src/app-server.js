const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.static('src/ui'));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  console.log('use Ctrl-C to stop this server');
});
