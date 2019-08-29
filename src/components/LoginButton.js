import React from 'react'
import '../css/LoginButton.css'

function LoginButton() {

    const spotifyLogin = () => {
        window.location = 'http://localhost:3001/login'
    }

    return (
        <div className="loginButtonWrapper">
            <button onClick={spotifyLogin} className='loginButton'>Login to Spotify</button>
        </div>
    )
}

export default LoginButton
