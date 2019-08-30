const express = require('express')
var cors = require('cors')
const cookieParser = require('cookie-parser')
const port = process.env.EXPRESS_PORT || 3001;

const app = express()

app.use(cors())
app.use(cookieParser())
app.use(express.json())


require('./api/spotify')(app)


// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));