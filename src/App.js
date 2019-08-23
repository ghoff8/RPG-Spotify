import React, { useState, useEffect } from 'react';
import './App.css';
import Player from  './components/Player'
import LoginButton from './components/LoginButton'
import qString from 'querystring'
import axios from 'axios'


function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [token, setToken] = useState(null)
  const [userProfile, setUserProfile] = useState(JSON)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    let codeParam = urlParams.get('access_token')
    codeParam !== null ? setLoggedIn(true) : setLoggedIn(false)
    if (loggedIn && token === null)
    {
      setToken(qString.parse(window.location.search))
      let userPromise = axios({
        method: 'GET',
        url: 'http://localhost:3001/userProfile',
      }).then(res => {
        setUserProfile(res.data)
      })
    }
  },[loggedIn, token])

  return (
    <div className='App'>
      <header className='App-header'>
        {!loggedIn 
          ? (<div className="title">
              <img src={ require('./content/images/dnd_logo.png')} className='dndLogo' alt="DND Logo"/>
                <div className="title-text">Playlist Dashboard</div>
              </div>)
          : (<div>
              <div className="title">
              <img src={ require('./content/images/dnd_logo.png')} className='dndLogo' alt="DND Logo"/>
                <div className="title-text">Playlist Dashboard</div>
              </div>
                <div className='loginNotice'>
                  Logged in as: {userProfile.display_name}
                </div>
              </div>
            ) 
        }
      </header>
      <body className='App-body'>
      {!loggedIn 
        ? <LoginButton/>
        : <Player/>
      }
      </body>
      <footer className='App-footer'>
        Github: https://github.com/ghoff8/DnD-Spotify
      </footer>
    </div>
  );
}

export default App;
