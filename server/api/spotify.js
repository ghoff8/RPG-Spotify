const ENDPOINTS = require('../service/constants.js')
const axios = require('axios')
const querystring = require('querystring')

let redirect_uri = 
    process.env.REDIRECT_URI || 
        'http://localhost:' + process.env.EXPRESS_PORT + '/callback'

let access_token = null

module.exports = (app) => {
    app.get('/userProfile', function(req,res) {
        axios({
            method: 'GET',
            url: ENDPOINTS.spotify_get_user,
            headers: {
                'Authorization': 'Bearer ' + access_token
            }
        }).then(response => {
            console.log(response)
            res.send(response.data)
        }).catch(error => {
            console.log(error)
        })

    })
    app.get('/login', function(req, res) {
        res.redirect(ENDPOINTS.spotify_auth +
            querystring.stringify({ 
                response_type: 'code',
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: 'user-read-private user-read-email',
                redirect_uri
            }))
    })

    app.get('/callback', function(req, res) {
        let code = req.query.code || null
        axios({
            method: 'POST',
            url: ENDPOINTS.spotify_token,
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
            access_token = response.data.access_token
            res.redirect('http://localhost:3000?access_token=' + response.data.access_token)
        }).catch(error => {
            console.log(error)
        })
    })
}