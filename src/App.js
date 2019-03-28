import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spotify from 'spotify-web-api-js';
//import SpotifyWebApi from 'spotify-web-api-node';

import './App.css';

import { setTracks }        from './actions/setTracks';
import { getHashParams }    from './actions/getHashParams';
import { incrementCount }   from './actions/incrementCount';
import { decrementCount }   from './actions/decrementCount';
import { toggleTimeFrame }  from './actions/toggleTimeFrame';
import { getUsers }         from './actions/getUsers';
import { addUser }          from './actions/addUser';
import { getNewToken }      from './actions/getNewToken'; //this is obsolete
import { editUser }         from './actions/editUser';

// COMPONENTS
import TopSongs from './Components/TopSongs'; 
import Users from './Components/Users';
import TokenManager from './Components/TokenManager';

const spotifyApi = new Spotify();
const playlist_id = '674PhRT9Knua4GdUkgzTel';
/* 
 * mapDispatchToProps
*/
const mapDispatchToProps = dispatch => ({
  setTracks: (tracks) => dispatch(setTracks(tracks)),
  getHashParams: () => dispatch(getHashParams()),
  incrementCount: () => dispatch(incrementCount()),
  decrementCount: () => dispatch(decrementCount()),
  toggleTimeFrame: () => dispatch(toggleTimeFrame()),
  getUsers:        () => dispatch(getUsers()),
  addUser:         (name,accessToken, refreshToken) => dispatch(addUser(name,accessToken, refreshToken)),
  getNewToken:    (refreshToken) => dispatch(getNewToken(refreshToken)),
  editUser: (name, refreshToken, accessToken) => dispatch(editUser(name, accessToken, refreshToken)),
})

/* 
 * mapStateToProps
*/
const mapStateToProps = state => ({
  ...state
})

/**
 * @class App
 * @extends {Component}
 */
class App extends Component {
  /**
   * @memberof App
   * @summary handles button click 
   */
  getTopTracks(){
    var totalTracks = [];
    const options = {limit: this.props.settings.count, offset: 0, time_range: this.props.settings.timeFrame};
    this.props.users.forEach((user, index) => {
      spotifyApi.setAccessToken(user.accessToken);
      spotifyApi.getMyTopTracks(options)
        .then((response) => {
          console.log(response);
          totalTracks = totalTracks.concat(response.items);
          if(index+1==this.props.users.length)
            console.log(totalTracks);
            this.props.setTracks(totalTracks);
            //need to do something about duplicates probably
        })

    })

    // spotifyApi.getMyTopTracks(options)    
    //   .then((response)=>{
    //     console.log(response);
    //     this.props.setTracks(response); 
    //     return response;
    //   });  
  }
  pushTracks(){
    var tracks = this.props.tracks;
    var trackUris = [];
    tracks.forEach((track) => {
      trackUris.push(track.uri);
    })
    console.log(trackUris);
    console.log(spotifyApi.getAccessToken());
    spotifyApi.addTracksToPlaylist(playlist_id, trackUris, {})
    .then((res) =>{
      console.log(res);
    });


    // var tracks = this.props.tracks;
    // var trackUris = 'uris=';
    // tracks.forEach((track) =>{
    //   trackUris += 'spotify%3Atrack%3A' +track.id + ',';
    //   //trackUris.push(track.id);
    // });
    // console.log(trackUris);
    // //spotifyApi.addTracksToPlaylist(playlistUri, trackUris);
    // var spotifyPlaylistUri = 'https://api.spotify.com/v1/playlists/'+playlist_id+'/tracks?'+trackUris;
    // console.log(this.props.users[0].accessToken);
    // fetch(spotifyPlaylistUri,{
    //   method: 'POST',
    //   headers:{
    //     "Authorization": "Bearer BQAcvgKGnZAmUsU3kvIrzwVURfwJ5gEKbhP7v4jUvTu4Z1c7hcDFTadVGV255P8_FPyijYc3Gk2cGhf0xJ44bCz-uP2v4ToWwscuiuCjM0piyMP6MJgRfBjorkG0kJVSYE9FlVIOjhE0RFnEtFsR73EoxaIYPbemFDmKhvLYYFrZPcRLTO7hpKCFtQVSaTQQTzJZiZQFzi5yRrL-DdS1h84q" ,
    //     "Content-Type": 'application/json'
    //   }
    // });
  }

  componentDidMount(){
    var testObj = {};
    this.props.getHashParams();

      fetch('/api/getusers')
      .then(function(res){
        return res.json();
      })
      .then(function(resJSON){
        //you should probably just load in everything from the server here
        //console.log(resJSON)
      });

  }

  constructor() {
    super();
  }
  render() {  
    if(this.props.users[0].accessToken){
      //console.log('setting access token');
      spotifyApi.setAccessToken(this.props.users[0].accessToken);
      //console.log(spotifyApi.getAccessToken());
    }
    var userRefreshToken = '';
    if(this.props.users[0].refreshToken !== '') userRefreshToken = this.props.users[0].refreshToken;
    return (
      <div className="App">
        <TokenManager 
          refreshToken = {this.props.users[0].refreshToken}
          editUser = {this.props.editUser}
        />
        

        <h1>Spotify Playlist API</h1>
        <a href="http://localhost:8888">
          <button>Log in to Spotify!</button>
        </a>
        <pre>
          {
            JSON.stringify(this.props)
          }
        </pre>

        <TopSongs 
          getTopTracks = {() => this.getTopTracks()}
          tracks = {this.props.tracks}
          settings = {this.props.settings}
          incrementCount = {this.props.incrementCount}
          decrementCount = {this.props.decrementCount}
          toggleTimeFrame = {this.props.toggleTimeFrame }
          pushTracks = {() => this.pushTracks()}
        />
        <Users
          getUsers = {this.props.getUsers}
          users = {this.props.users}
          addUser = {this.props.addUser}
          hashParams = {this.props.hashParams}
        />
      </div>
    );
  }
}

//connect(mapStateToProps, mapDispatchToProps)(TokenManager);
export default connect(mapStateToProps, mapDispatchToProps)(App);
