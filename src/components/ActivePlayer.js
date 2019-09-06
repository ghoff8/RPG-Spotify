import React, { useRef } from 'react'
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
        }).then(res => {
        }).catch(err => {
            console.log(err)
        })
    }

    return(
        <div>
            <div className='imageAndWidgets'>
                <img className='albumImage' src={props.player.item.album.images[1].url} alt='Album Cover'/>
                <button className = 'nextSongButton' onClick={() => nextSong()} ref={nextSongRef}>
                    <img src={require('../content/images/skip.png')} className='nextSongButton' alt='arrow'></img>
                </button>
                <div className='sliderAndIcon'>
                    <img src={require('../content/images/volume.png')} className='volumeIcon' alt=''></img>
                    <div className = 'volumeSlider' key={props.player.device.volume_percent}>
                        <Slider min={0} max={100} vertical defaultValue={props.player.device.volume_percent} onAfterChange={sliderChange}/>
                    </div>
                </div>
                <h3 className = 'songInfo'>{props.player.item.artists[0].name} - {props.player.item.name} </h3>
            </div>
        </div>
    )
}

function propDiff(prevProps, nextProps){
    return ((prevProps.player.item.name === nextProps.player.item.name) &&
        (prevProps.player.device.volume_percent === nextProps.player.device.volume_percent))
}
export default React.memo(ActivePlayer, propDiff)
