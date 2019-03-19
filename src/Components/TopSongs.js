
import React, { Component } from 'react';
export default class TopSongs extends Component {
  render(){
    return (
      <div>
        <button onClick = {() =>this.props.getTopTracks()}>
          Get Top Tracks
        </button>
        <button onClick ={() => this.props.incrementCount()}>
          Increase Song Count
        </button>
        <button onClick = {()=> this.props.decrementCount()}>
          Decrease Song Count
        </button>
        <button onClick = {() => this.props.toggleTimeFrame()}>
          Toggle Time Frame
        </button>
        <h4>Current Song Count: {this.props.settings.count}</h4>
        <ul>
          {
            this.props.tracks.map((item, i) => <li key={i}>{item.name}, {item.artists[0].name}</li> )
          }   
        </ul>
      </div>
    )
  } 
}  