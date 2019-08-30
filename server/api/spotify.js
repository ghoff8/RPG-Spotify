const ENDPOINTS = require('../service/constants.js')
const axios = require('axios')
const querystring = require('querystring')
let redirect_uri = 
    process.env.REDIRECT_URI || 
        'http://localhost:' + process.env.EXPRESS_PORT + '/callback'

module.exports = (app) => {
   
    app.post('/apiRefresh', function(req,res) {
        axios({
            method: 'POST',
            url: ENDPOINTS.spotify_token,
            headers: {
                'Authorization': 'Basic ' + (new Buffer(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                    ).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                grant_type: 'refresh_token',
                refresh_token: req.query.refresh_token
            }
        }).then(response => {
            res.send(response.data)
        }).catch(err => {
            console.log(err)
        })
    })

    app.get('/userProfile', function(req,res) {
        axios({
            method: 'GET',
            url: ENDPOINTS.spotify_get_user,
            headers: {
                'Authorization': 'Bearer ' + req.cookies.access_token
            }
        }).then(response => {
            res.header('Access-Control-Allow-Credentials', true)
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
            res.send(response.data)
        }).catch(error => {
            console.log(error)
        })

    })
    app.get('/player', function(req,res) {
        axios({
            method: 'GET',
            url: ENDPOINTS.spotify_get_player,
            headers: {
                'Authorization': 'Bearer ' + req.cookies.access_token
            }
        }).then(response => {
            res.header('Access-Control-Allow-Credentials', true)
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
            res.send(response.data)
        }).catch(err => {
            console.log(err.data)
        })
    })

    app.get('/login', function(req, res) {
        res.redirect(ENDPOINTS.spotify_auth +
            querystring.stringify({ 
                response_type: 'code',
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: 'user-read-private user-read-email user-modify-playback-state user-read-currently-playing user-read-playback-state user-library-read',
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
            timeout: 5000
        }).then(response =>{
            /*axios({
                method: 'POST',
                url: 'http://localhost:3001/apiRefresh?refresh_token=' + response.data.refresh_token
            }).then(secRes => {
                res.cookie('access_token', secRes.data.access_token, {maxAge: 3600000})
                res.cookie('refresh_token', response.data.refresh_token)
                res.redirect(302, 'http://localhost:3000')
            }).catch(err => {
                console.log(err.data)
            })*/
            res.cookie('access_token', response.data.access_token, {maxAge: 3600000, signed: false})
            res.cookie('refresh_token', response.data.refresh_token)
            res.redirect(302, 'http://localhost:3000')
        }).catch(error => {
            console.log(error)
        })
    })
}