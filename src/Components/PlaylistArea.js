import React, { Component } from 'react';
export default class PlaylistArea extends Component {
  render(){
    return (
      <div className = "playlist_area_container">
      	<div className="web_player_container flex-item">
        	<iframe className = "web_player_playlist" src="https://open.spotify.com/embed/user/waytoofatdolphin/playlist/674PhRT9Knua4GdUkgzTel" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>
        <div className="playlist_description_area flex-item">
            <h4>Last updated: {this.props.mapLastUpdated(this.props.lastUpdated)}</h4>
            <p className="description">To follow this playlist, you can either follow me and then navigate to the playlist within the Spotify app, or click <a className="playlist_link" href="https://open.spotify.com/user/waytoofatdolphin/playlist/674PhRT9Knua4GdUkgzTel?si=BvVhI-voTCugcTvfPT4vgw">here</a> to go straight to the playlist.</p>
            <iframe src="https://open.spotify.com/follow/1/?uri=spotify:user:waytoofatdolphin&size=detail&theme=light&show-count=0" width="300" height="56" scrolling="no" frameborder="0" className ="follow_button"  allowtransparency="true"></iframe>
        	<div className="description_divider"></div>
        	<p className="description">Below is the current up to date playlist, along with the name of each user who contributed each song.</p>
        </div>
      </div>
    )
  } 
}  

