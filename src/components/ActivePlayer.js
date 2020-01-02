import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import Proptypes from 'prop-types'
import Slider from 'rc-slider'
import '../css/Player.css'
import 'rc-slider/assets/index.css';

axios.defaults.withCredentials = true

ActivePlayer.propTypes = {
    player: Proptypes.object
}

function ActivePlayer(props) {
    const nextSongRef = useRef(null)
    const ppRef = useRef(null)
    const [waitForUpdate, setWaitForUpdate] = useState(false)

    useEffect(() => {
        if(waitForUpdate){
            setWaitForUpdate(false)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.player.is_playing])

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

    function sliderChange(value){
        axios({
            method: 'POST',
            url: 'http://localhost:3001/setVolume?volume=' + value
        }).catch(err => {
            console.log(err)
        })
    }

    function changePlayback(){
        setWaitForUpdate(true)
        ppRef.current.content = "../content/images/pause-play-button-greyed.png"
        if (props.player.is_playing) {
            axios({
                method: 'POST',
                url: 'http://localhost:3001/pause'
            }).catch(err => {
                console.log(err)
            })
        }
        else {
            axios({
                method: 'POST',
                url: 'http://localhost:3001/resume'
            }).catch(err => {
                console.log(err)
            })
        }
    }

    return(
        <div className='imageAndWidgets'>
            <div className='albumWrapper'>
                <img className='albumImage' src={props.player.item.album.images[1].url} alt='Album Cover'/>
                <button className = 'ppButton' onClick={() => changePlayback()} disabled={waitForUpdate} ref={ppRef}>
                    <img className = 'ppButton' alt='pause/play'></img>
                </button>
            </div>
            <button className = 'nextSongButton' onClick={() => nextSong()} ref={nextSongRef}>
                <img src={require('../content/images/skip-fill.png')} className='nextSongButton' alt='arrow'></img>
            </button>
            <div className='sliderAndIcon'>
                <img src={require('../content/images/volume.png')} className='volumeIcon' alt=''></img>
                <div className = 'volumeSlider' key={props.player.device.volume_percent}>
                    <Slider min={0} max={100} vertical defaultValue={props.player.device.volume_percent} onAfterChange={sliderChange}/>
                </div>
            </div>
            <h3 className = 'songInfo'>{props.player.item.artists[0].name} - {props.player.item.name} </h3>
        </div>
    )
}

function propDiff(prevProps, nextProps){
    return ((prevProps.player.item.name === nextProps.player.item.name) &&
        (prevProps.player.device.volume_percent === nextProps.player.device.volume_percent) &&
        (prevProps.player.is_playing === nextProps.player.is_playing))
}
export default React.memo(ActivePlayer, propDiff)
