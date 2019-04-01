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

import Promise from 'bluebird';

const spotifyApi = new Spotify();
const playlist_id = '674PhRT9Knua4GdUkgzTel';

const mapDispatchToProps = dispatch => ({
  setTracks: (tracks) => dispatch(setTracks(tracks)),
  getHashParams: () => dispatch(getHashParams()),
  incrementCount: () => dispatch(incrementCount()),
  decrementCount: () => dispatch(decrementCount()),
  toggleTimeFrame: () => dispatch(toggleTimeFrame()),
  getUsers:        () => dispatch(getUsers()),
  addUser:         (id, name,accessToken, refreshToken) => dispatch(addUser(id,name,accessToken, refreshToken)),
  getNewToken:    (refreshToken) => dispatch(getNewToken(refreshToken)),
  editUser: (name, refreshToken, accessToken) => dispatch(editUser(name, accessToken, refreshToken)),
})

const mapStateToProps = state => (
  {
    ...state
    // how do i shred more than this
  }
)


class App extends Component {
  getTopTracks(){
    var totalTracks = [];
    const options = {limit: this.props.settings.count, offset: 0, time_range: this.props.settings.timeFrame};
    this.props.users.forEach((user, index) => {
      spotifyApi.setAccessToken(user.accessToken);
      spotifyApi.getMyTopTracks(options)
        .then((response) => {
          totalTracks = totalTracks.concat(response.items);
          if(index+1===this.props.users.length)
            this.props.setTracks(totalTracks);
            //need to do something about duplicates probably  
        });
    }); 
  }
  pushTracks(){
    var tracks = this.props.tracks;
    var trackUris = [];
    tracks.forEach((track) => {
      trackUris.push(track.uri);
    })
    console.log(trackUris);
    
    //var accessTokenJared = this.props.users[0].accessToken;
    var accessTokenJared = '';
    this.props.users.forEach((user) => {
      if(user.spotifyId == "waytoofatdolphin")
        accessTokenJared = user.accessToken;
    });
    spotifyApi.setAccessToken(accessTokenJared);
    console.log(spotifyApi.getAccessToken());
    spotifyApi.addTracksToPlaylist(playlist_id, trackUris, {})
    .then((res) =>{
      console.log(res);
    });
  }

  getNewAccessTokens(){
    this.props.users.forEach((user) =>{
      var accessToken ='';
      var refreshToken = user.refreshToken;
      var name = '';
      fetch('http://localhost:8888/refresh_token?refresh_token=' + refreshToken, {
        method: 'GET',
      })  
      .then(function(res){
        return res.json ();
      })
      .then(function(response){    
        fetch('/api/edituser',{
          method: 'POST',
          body: JSON.stringify({
            accessToken: response.access_token,
            refreshToken: refreshToken
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(function(res){
          return res.json();
        })
        .then(function(resJSON){
          console.log(resJSON);
          name = resJSON.name;
          console.log('name ' +name);
          accessToken = resJSON.accessToken;
          refreshToken = resJSON.refreshToken;
          //editUser(resJSON.name, resJSON.accessToken, resJSON.refreshToken);

         // this.editUserFunc();
         // this.props.editUser(resJSON.name, resJSON.accessToken, resJSON.refreshToken);
          // some redux shit that i dont understand: tldr, how do i get my redux here isntead of passing it
        });
      });
    });
  }
  handleSignIn(){
    function getParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }
    var params = getParams();
    if(!this.isEmpty(params)){
      spotifyApi.setAccessToken(params.access_token);
      spotifyApi.getMe().then((response) => {
        this.props.addUser(response.id, response.display_name, params.access_token, params.refresh_token);
      });
    }
  }
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
  componentDidMount(){ 
    var handleSignInPromise = Promise.promisify(this.handleSignIn);
    this.props.getHashParams();
    this.handleSignIn();
    // handleSignInPromise().then((res) =>{
    //   console.log(res);
    // });
    //get users
    //refresh all tokens
    //get tracks
    this.props.getUsers();
    if(this.props.users[0].name !== '')
        this.getTopTracks();
     
  }
  constructor() {
    super();
  }
  render() {
    return (
      <div className="App">
        <TokenManager 
          getNewAccessTokens = {() =>this.getNewAccessTokens()}
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
          getTopTracks = {() => this.getTopTracks()}
          tracks = {this.props.tracks}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

