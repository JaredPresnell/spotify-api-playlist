import React, { Component } from 'react';

//COMPONENTS
import PlaylistArea from './PlaylistArea';

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
        <PlaylistArea
          lastUpdated = {this.props.lastUpdated}
          mapLastUpdated = {this.mapLastUpdated}
        />
        
        
        <div className = "playlist_items_container">
          <div className="track_iframes flex-item">
            <ul>
              {
                this.props.tracks.map((item, i) => {
                  var addDividerClass="container ";
                  var lastUser = i>1 ?  this.props.tracks[i-1].user : item.user; 
                  let uri = item.trackUri.split(":");
                  let iframeSrc ="https://open.spotify.com/embed/" + uri[1] + "/" + uri[2];
                  if(lastUser !== item.user){
                    addDividerClass += "dividerClass";
                  } 
                  //if(i==5) addDividerClass += "dividerClass"; //for testing 
                  return(
                      <div key={item.name + i} className={addDividerClass}>
                      {/*}
                      {console.log(item)}
                      <div className="flex-item song_item">
                        {item.name} by {this.mapArtists(item.artists)}
                      </div>
                      */}
                      <iframe src={iframeSrc} width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
                      {/*
                      <div className="flex-item spotify_user">
                        {item.user}
                      </div>
                    */}
                    </div>
                  )}
                )
              }   
            </ul>
          </div>
          <div className = "user_names flex-item"> 
            <ul>
            {
              this.props.tracks.map((item, i) => {
                var addDividerClass="container ";
                var lastUser = i>1 ?  this.props.tracks[i-1].user : item.user; 
                let uri = item.trackUri.split(":");
                let iframeSrc ="https://open.spotify.com/embed/" + uri[1] + "/" + uri[2];
                if(lastUser !== item.user){
                  addDividerClass += "dividerClass";
                } 
                //if(i==5) addDividerClass += "dividerClass"; //for testing 
                return(
                    <div key={item.name + i} className={addDividerClass}>
                    <div className="flex-item spotify_user">
                      <p className="spotify_user_paragraph">{item.user}</p>
                    </div>
                  </div>
                )}
              )
            }
            </ul>
          </div>
        </div>
      </div>
    )
  } 
}  
