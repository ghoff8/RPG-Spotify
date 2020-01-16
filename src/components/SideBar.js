import React from 'react'
import '../css/SideBar.css'
import PlaylistList from './PlaylistList'

export default function SideBar() {
    return (
        <div className="sideBarWrapper">
            <PlaylistList/>
            <PlaylistList/>
            <PlaylistList/>
            <PlaylistList/>
        </div>
    )
}
