import React, { useState } from 'react';
import './App.css';
import Player from  './components/Player'
import LoginButton from './components/LoginButton'
import axios from 'axios'
import Cookies from 'js-cookie'


function App() {
  const [userProfile, setUserProfile] = useState(JSON)

  function HeaderRender() {
    if (Cookies.get('access_token'))
    {
      if (userProfile === JSON)
      {
        axios({
          method: 'GET',
          url: 'http://localhost:3001/userProfile?access_token=' + Cookies.get('access_token'),
        }).then(res => {
          setUserProfile(res.data)
        }).catch(error => {
          console.log(error)
        })
      }
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

  return (
    <div className='App'>
      <header className='App-header'>
        <div className="title">
          <img src={require('./content/images/dnd_logo.png')} className='dndLogo' alt="DND Logo"/>
          <div className="title-text">Playlist Dashboard</div>
        </div>
        <HeaderRender/>
      </header>
      <body className='App-body'>
      {!Cookies.get('access_token')
        ? <LoginButton/>
        : <div style={{ width: "100%", height: "100%"}}>
            <Player
              access_token={Cookies.get('access_token')}
            />
            <div style={{ width: "100%", position: "relative"}}></div>
          </div>
      }
      </body>
      <footer className='App-footer'>
        Github: https://github.com/ghoff8/RPG-Spotify
      </footer>
    </div>
  );
}

export default App;
