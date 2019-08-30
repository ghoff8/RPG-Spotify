import React, {useState, useEffect} from 'react'
import Proptypes from 'prop-types'
import axios from 'axios'
import '../css/Player.css'


axios.defaults.withCredentials = true

Player.propTypes = {
    access_token: Proptypes.string
}

function Player(props) {
    const [token, setToken] = useState(props.access_token || null)
    const [isWorking, setIsWorking] = useState(false)
    const [player, setPlayer] = useState(null)

    useEffect(() => {
        if (player === null)
        {
            setToken(props.access_token)
            axios({
                method: 'GET',
                url: 'http://localhost:3001/player'
            }).then(res => {
                setPlayer(res.data)
            })
        }
    }, [player, props.access_token, token])

    useEffect(() => {
        const tempPoll = setInterval(() => {
            if (isWorking) {
                return
            }
            setIsWorking(true)
            axios({
                method: 'GET',
                url: 'http://localhost:3001/player'
            }).then(res => {
                setPlayer(res.data)
            }).catch(err => {
                console.log(err)
            })
            setIsWorking(false)
            }, 3000)
        return () => clearInterval(tempPoll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    function ActivePlayer() {
        return(
            <div>
                <div className='imageAndWidgets'>
                    <img className='albumImage' src={player.item.album.images[1].url} alt='Album Cover'/>
                    <button className = 'nextSongButton' onClick={() => {console.log('button click')}}>
                        <img src={require('../content/images/skip.png')} className='nextSongButton' alt='arrow'></img>
                    </button>
                </div>
                <h3 className = 'songInfo'>{player.item.artists[0].name} - {player.item.name} </h3>
            </div>
        )
    }

    if (player === null)
        return <div/>
    return (
        <div className='basePlayer'>
            { 
              player !== ''
                ? <ActivePlayer player={player}/>
                : <h1>No Player Active</h1>
            } 
        </div>
    )
}
export default Player
