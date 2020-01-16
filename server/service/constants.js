 // url endpoints for Spotify web API
 module.exports = Object.freeze({
    spotify_auth: 'https://accounts.spotify.com/authorize?',
    spotify_token: 'https://accounts.spotify.com/api/token',
    spotify_get_me: 'https://api.spotify.com/v1/me',
    spotify_get_player: 'https://api.spotify.com/v1/me/player',
    spotify_next_song: 'https://api.spotify.com/v1/me/player/next',
    spotify_set_volume: 'https://api.spotify.com/v1/me/player/volume',
    spotify_resume_playback: 'https://api.spotify.com/v1/me/player/play',
    spotify_pause_playback: 'https://api.spotify.com/v1/me/player/pause',
    spotify_get_playlist: 'https://api.spotify.com/v1/playlists',
    spotify_get_user: 'https://api.spotify.com/v1/users',
 })