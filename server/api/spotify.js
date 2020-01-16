const ENDPOINTS = require('../service/constants.js')
const axios = require('axios')
const querystring = require('querystring')
const REDIRECT_URI = 
    process.env.REDIRECT_URI || 
        'http://localhost:' + process.env.EXPRESS_PORT + '/callback'

module.exports = (app) => {
   
    app.post('/api-refresh', function(req,res) {
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
            console.log(new Date() + ': Requested Spotify Token Refresh - Status: ' + response.status)
            res.send(response.data)
        }).catch(err => {
            console.error(err.data)
        })
    })

    app.post('/next-song', function(req,res) {
        axios({
            method: 'POST',
            url: ENDPOINTS.spotify_next_song,
            headers: {
                'Authorization': 'Bearer ' + req.cookies.access_token
            }
        }).then(response => {
            console.log(new Date() + ': Requested Next Song - Status: ' + response.status)
            res.sendStatus(response.status)
        }).catch(err => {
            console.error(err.data)
        })
    })

    app.post('/set-volume', function(req,res) {
        axios({
            method: 'PUT',
            url: ENDPOINTS.spotify_set_volume,
            params: {
                volume_percent: req.query.volume
            },
            headers: {
                'Authorization': 'Bearer ' + req.cookies.access_token
            }
        }).then(response => {
            console.log(new Date() + ': Changed Volume to ' + response.config.params.volume_percent +'% - Status: ' + response.status)
            res.sendStatus(response.status)
        }).catch(err => {
            console.error(err.data)
        })
    })

    app.post('/resume', function(req,res){
        axios({
            method: 'PUT',
            url: ENDPOINTS.spotify_resume_playback,
            headers: {
                'Authorization': 'Bearer ' + req.cookies.access_token
            }
        }).then(response => {
            console.log(new Date() + ': Resumed Current Song - Status: ' + response.status)
            res.send(response.data)
        }).catch(err => {
            console.error(err.dat)
        })
    })

    app.post('/pause', function(req,res){
        axios({
            method: 'PUT',
            url: ENDPOINTS.spotify_pause_playback,
            headers: {
                'Authorization': 'Bearer ' + req.cookies.access_token
            }
        }).then(response => {
            console.log(new Date() + ': Paused Current Song - Status: ' + response.status)
            res.send(response.data)
        }).catch(err => {
            console.error(err.data)
        })
    })

    app.get('/user-profile', function(req,res) {
        axios({
            method: 'GET',
            url: ENDPOINTS.spotify_get_me,
            headers: {
                'Authorization': 'Bearer ' + req.cookies.access_token
            }
        }).then(response => {
            console.log(new Date() + ': Requested User Profile - Status: ' + response.status)
            res.send(response.data)
        }).catch(err => {
            console.error(err.data)
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
            if (response) {
                console.log(new Date() + ': Requested Spotify Player Info - Status: ' + response.status);
            }
            // TODO: refine circumstance to determine when to refresh token 
            if (response === undefined) {
                axios({
                    method: 'POST',
                    url: 'http://localhost:3001/apiRefresh?refresh_token=' + req.cookies.refresh_token
                }).then(secRes => {
                    res.cookie('access_token', secRes.data.access_token, {maxAge: 3600000})
                    res.cookie('refresh_token', req.cookies.refresh_token)
                    axios({
                        method: 'GET',
                        url: ENDPOINTS.spotify_get_player,
                        headers: {
                            'Authorization': 'Bearer ' + secRes.data.access_token
                        }
                    }).then(thirdRes => {
                        res.send(thirdRes.data)
                    }).catch(err => {
                        console.err(err.data)
                    })
                }).catch(err => {
                    console.error(err.data)
                })
            }
            else {
                res.send(response.data)
            }
        }).catch(err => {
            console.log(err.data)
        })
    })

    app.get('/fetch-playlists', async function(req,res) {
        async function requestPlaylistChunk(offset) {
            let results = axios({
                method: 'GET',
                url: ENDPOINTS.spotify_get_user + "/bezoing/playlists",
                params: {
                    limit: 50,
                    offset: offset
                },
                headers: {
                    'Authorization': 'Bearer ' + req.cookies.access_token
                },
            }).then(response => {
                return response.data;
            }).catch(err => {
                console.err(err.data)
            })
            return results;
        }
        let playlists = [];
        let offset = 0;
        let dataChunk = await requestPlaylistChunk(offset);
        playlists.push(...dataChunk.items);
        while (dataChunk.next !== null) {
            offset += 50;
            dataChunk = await requestPlaylistChunk(offset);
            playlists.push(...dataChunk.items);
        }
        res.send(playlists);
    })

    app.get('/playlist', function(req,res) {
        axios({
            method: 'GET',
            url: ENDPOINTS.spotify_get_playlist,
            params: {
                playlist_id: req.query.playlist_id
            },
            headers: {
                'Authorization': 'Bearer ' + req.cookies.access_token
            }
        }).then(response => {
            console.log(response.data);
        })
    })

    app.get('/login', function(req, res) {
        res.redirect(ENDPOINTS.spotify_auth +
            querystring.stringify({ 
                response_type: 'code',
                client_id: process.env.SPOTIFY_CLIENT_ID,
                scope: 'user-read-private user-read-email user-modify-playback-state user-read-currently-playing user-read-playback-state user-library-read',
                redirect_uri: REDIRECT_URI
            }))
    })

    app.get('/callback', function(req, res) {
        let code = req.query.code || null
        axios({
            method: 'POST',
            url: ENDPOINTS.spotify_token,
            headers: {
                'Authorization': 'Basic ' + (new Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                    ).toString('base64')),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            params: {
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI
            },
            timeout: 5000
        }).then(response =>{
            console.log(new Date() + ': Requested Spotify Access Tokens - Status: ' + response.status)
            res.cookie('access_token', response.data.access_token, {maxAge: 3600000, signed: false})
            res.cookie('refresh_token', response.data.refresh_token)
            res.redirect(302, 'http://localhost:3000')
        }).catch(err => {
            console.error(err)
        })
    })
}
 
//refresh logic
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