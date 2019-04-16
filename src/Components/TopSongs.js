import React, { Component } from 'react';
export default class TopSongs extends Component {
  mapLastUpdated(date){
    var mappedDate =date;
    var parsedDate = mappedDate.split('T')[0];
    var parsedTime = mappedDate.split('T')[1];
    var datesArray = parsedDate.split('-');
    return datesArray[1] + '-'+datesArray[2]+'-'+datesArray[0]; 
    //return date;
  }
  mapArtists(artists){
    var artistsTotal='';
    artists.forEach((artist, index)=>{
      if(index==0){
        artistsTotal += artist.name;
      }
      else {
        artistsTotal += ', ' + artist.name;
      }
    }); 
    return artistsTotal;
  }
  render(){
    return (
      <div className="playlist_container">
        <h1 className="playlist_title">Current Playlist</h1>
        <p>This is the current playlist, with the names of the song artists and the Spotify user who contributed each song.</p>
        <h4>Last updated: {this.mapLastUpdated(this.props.lastUpdated)}</h4>
        {/*<li key={i}>{item.name}, {item.artists[0].name}, {item.user}</li> */}
        <ul>
          {
            //console.log(this.props.tracks)
            this.props.tracks.map((item, i) => 
              
              <div key={item.name + i} className="container">
                <div className="flex-item song_item">
                  {item.name} by {this.mapArtists(item.artists)}
                </div>
                <div className="flex-item">
                  {item.user}
                </div>
              </div>  
              )
          }   
        </ul>
        {/*<button onClick = {()=> this.props.getTracks()}>Get Playlist</button>*/}
      </div>
    )
  } 
}  