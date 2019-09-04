import React, {useState, useEffect, useRef} from 'react'
import Proptypes from 'prop-types'
import Slider from 'rc-slider'
import axios from 'axios'
import 'rc-slider/assets/index.css';
import '../css/Player.css'

axios.defaults.withCredentials = true

Player.propTypes = {
    access_token: Proptypes.string
}

function Player(props) {
    const [isWorking, setIsWorking] = useState(false)
    const [player, setPlayer] = useState(null)
    const nextSongRef = useRef(null)

    const nextSong = () => {
        nextSongRef.current.disabled = true
        axios({
            method: 'POST',
            url: 'http://localhost:3001/nextSong'
        }).then(res => {
            nextSongRef.current.disabled = false
        }).catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        if (player === null)
        {
            axios({
                method: 'GET',
                url: 'http://localhost:3001/player'
            }).then(res => {
                setPlayer(res.data)
            })
        }
    }, [player])

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
                console.log("Data" + res.data)
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
                <div className='imageAndWidgets' style={{backgroundColor: 'rgba(0,0,0,0.2)', padding: '2%'}}>
                    <img className='albumImage' src={player.item.album.images[1].url} alt='Album Cover'/>
                    <button className = 'nextSongButton' onClick={() => nextSong()} ref={nextSongRef}>
                        <img src={require('../content/images/skip.png')} className='nextSongButton' alt='arrow'></img>
                    </button>
                    <Slider min={0} max={100} vertical={true}/>
                    <h3 className = 'songInfo'>{player.item.artists[0].name} - {player.item.name} </h3>
                </div>
                
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
