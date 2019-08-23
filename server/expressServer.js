const express = require('express');
const app = express();
const port = process.env.EXPRESS_PORT || 3001;

var cors = require('cors')
app.use(express.json())
app.use(cors())
require('./api/spotify')(app)

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
