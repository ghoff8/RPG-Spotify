const express = require('express');
const app = express();
const port = process.env.EXPRESS_PORT || 3001;

app.use(express.json())
require('./api/spotify')(app)

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
