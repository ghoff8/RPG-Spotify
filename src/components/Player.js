import React, {useState, useEffect} from 'react'
import Proptypes from 'prop-types'
import ActivePlayer from './ActivePlayer'
import axios from 'axios'
import '../css/Player.css'

axios.defaults.withCredentials = true

Player.propTypes = {
    access_token: Proptypes.string
}

function Player(props) {
    const [isWorking, setIsWorking] = useState(false)
    const [player, setPlayer] = useState(null)

    useEffect(() => {
        if (player === null)
        {
            axios({
                method: 'GET',
                url: 'http://localhost:3001/player'
            }).then(res => {
                if (res.data.currently_playing_type === 'episode')
                    setPlayer('')
                else
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
                if (res.data.currently_playing_type === 'episode')
                    setPlayer('')
                else
                    setPlayer(res.data)
            }).catch(err => {
                console.log(err)
            })
            setIsWorking(false)
            }, 3000)
        return () => clearInterval(tempPoll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    if (player === null)
        return <div/>
    return (
        <div className='basePlayer'>
            { 
              player !== ''
                ? <>
                    <ActivePlayer player={player}/>
                    <div style={{width:"100%", height: "100%"}}></div>
                  </>
                : <div className='noPlayer'><h1>No Player Active</h1></div>
            } 
        </div>
    )
}
export default Player
