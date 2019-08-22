const axios = require('axios')
const querystring = require('querystring')


let redirect_uri = 
    process.env.REDIRECT_URI || 
        'http://localhost:' + process.env.EXPRESS_PORT + '/callback'

module.exports = (app) => {
    
    app.get('/login', function(req, res) {
        console.log(process.env)
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({ 
                response_type: 'code',
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: 'user-read-private user-read-email',
                redirect_uri
            }))
    })

    app.get('/callback', function(req, res) {
        let code = req.query.code || null
        let authOptions = {
            'url': 'https://accounts.spotify.com/api/token',
            'form': {
                code: code,
                redirect_uri,
                grant_type: 'authorization_code'
            },
            'headers': {
                'Authorization': 'Basic ' + (new Buffer(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64'))
            }
        }

        axios({
            method: 'POST',
            url: authOptions.url,
            headers: {
                'Authorization': 'Basic ' + (new Buffer(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                    ).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirect_uri,
            },
            timeout: 1000
        }).then(response =>{
            console.log(response)
            res.redirect('http://localhost:3000?access_token=' + response.data.access_token)
        }).catch(error => {
            console.log(error)
        })
    })
}