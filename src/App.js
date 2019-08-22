import React from 'react';
import './App.css';


const spotifyLogin = () => {
  console.log(process.env)
  window.location = 'http://localhost:3001/login'
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <body>
        <button onClick={spotifyLogin}>Login</button>
      </body>
      <footer>
        Created by: Grant Hoffmann
      </footer>
      </header>
    </div>
  );
}

export default App;
