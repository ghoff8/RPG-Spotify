const express = require('express');
const app = express();
const port = process.env.EXPRESS_PORT || 3001;
const session = require('express-session')

var cors = require('cors')
app.use(express.json())
app.use(cors())
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

require('./api/spotify')(app)

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));
