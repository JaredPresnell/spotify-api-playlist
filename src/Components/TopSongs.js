import React, { Component } from 'react';
export default class TopSongs extends Component {
  render(){
    return (
      <div>
        <h1>Current Playlist</h1>
        <p>This is the current playlist, with the names of the song artists and the spotify users who contributed each song</p>
        <ul>
          {
            //console.log(this.props.tracks)
            this.props.tracks.map((item, i) => <li key={i}>{item.name}, {item.artists[0].name}, {item.user}</li> )
          }   
        </ul>
        {/*<button onClick = {()=> this.props.getTracks()}>Get Playlist</button>*/}
      </div>
    )
  } 
}  