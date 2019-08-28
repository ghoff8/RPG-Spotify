import React, { useState, useEffect } from 'react';
import './App.css';
import Player from  './components/Player'
import LoginButton from './components/LoginButton'
import qString from 'querystring'
import axios from 'axios'
import Cookies from 'js-cookie'


function App() {
  const [token, setToken] = useState(null)
  const [userProfile, setUserProfile] = useState(JSON)

  function HeaderRender() {
    if (Cookies.get('access_token'))
    {
      axios({
        method: 'GET',
        url: 'http://localhost:3001/userProfile?access_token=' + Cookies.get('access_token'),
      }).then(res => {
        setUserProfile(res.data)
      }).catch(error => {
        console.log(error)
      })
      return (
        <div>
          <div className='loginNotice'>
            Logged in as: {userProfile.display_name}
          </div>
        </div>
      )
    }
    else
      return null
  }

  useEffect(() => {
    console.log("Cookie:" + Cookies.get('access_token'))
    //if (Cookies.get('token'))
  }, [])

  return (
    <div className='App'>
      <header className='App-header'>
        <div className="title">
          <img src={ require('./content/images/dnd_logo.png')} className='dndLogo' alt="DND Logo"/>
          <div className="title-text">Playlist Dashboard</div>
        </div>
        <HeaderRender/>
      </header>
      <body className='App-body'>
      {!Cookies.get('access_token')
        ? <LoginButton/>
        : <Player
            access_token={Cookies.get('access_token')}
          />
      }
      </body>
      <footer className='App-footer'>
        Github: https://github.com/ghoff8/DnD-Spotify
      </footer>
    </div>
  );
}

export default App;
