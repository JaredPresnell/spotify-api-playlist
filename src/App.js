import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spotify from 'spotify-web-api-js';
//import SpotifyWebApi from 'spotify-web-api-node';

import './App.css';

import { setTracks }        from './actions/setTracks';
import { setLastUpdated }   from './actions/setLastUpdated';
import { getHashParams }    from './actions/getHashParams';
import { getUsers }         from './actions/getUsers';
import { addUser }          from './actions/addUser';
import { getNewToken }      from './actions/getNewToken'; //this is obsolete
import { editUser }         from './actions/editUser';

// COMPONENTS
import TopSongs from './Components/TopSongs'; 
import Users from './Components/Users';

import Promise from 'bluebird';

const spotifyApi = new Spotify();
const playlist_id = '674PhRT9Knua4GdUkgzTel';

const spotifyAuthPath = getSpotifyAuthPath();
const spotifyLoginPath = getSpotifyLoginPath();

function getSpotifyAuthPath(){
  if(window.location.host =="localhost:3000"){
    return "http://localhost:8888/spotify/"
  }
  else return "/spotifyauth/"
}
function getSpotifyLoginPath(){
  if(window.location.host === "localhost:3000"){
    return "http://localhost:8888/spotify/login"
  }
  else return "/spotifyauth/login"
}


const mapDispatchToProps = dispatch => ({
  setTracks: (tracks) => dispatch(setTracks(tracks)),
  setLastUpdated: (lastUpdated) => dispatch(setLastUpdated(lastUpdated)),
  getHashParams: () => dispatch(getHashParams()),
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
  getNewAccessTokens(){
    this.props.users.forEach((user) =>{
      var refreshToken = user.refreshToken;
      console.log('old access token: ' + user.accessToken);
      //fetch('https://localhost:8888/refresh_token?refresh_token=' + refreshToken, {
      //fetch('/spotify/refresh_token?refresh_token=' + refreshToken, {
      fetch(spotifyAuthPath + "refresh_token?refresh_token=" + refreshToken, {

        method: 'GET',
      })  
      .then(function(res){
        return res.json();
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
        });
      });
    });
  }
  handleSignIn(accessToken, refreshToken){
    //console.log('handling my dude');
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getMe().then((response) => {
        this.props.addUser(response.id, response.display_name, accessToken, refreshToken)
        .then((res)=>{
          //console.log('async inside adduser.then()');
          //console.log(res);   
          this.getTracks();
        });
    });
  }
  handleLoad(){
    //const _this = this;
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
    console.log(params);
    if(!this.isEmpty(params)){
        console.log('now we should be handling sign in');
        this.handleSignIn(params.access_token, params.refresh_token);    
    }
    else {
      this.getTracks();
    }
   
  }
  getTracks(){
    // **need to send uri data with tracks
    fetch('/api/gettracks', {method: "GET"})
    .then((res)=>{
      return res.json();
    })
    .then((resJSON)=>{
      this.props.setLastUpdated(resJSON.lastUpdated);
      this.props.setTracks(resJSON.tracks);
    });
  }
  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }
  componentDidMount(){ 
    this.handleLoad();     
  }
  doEverything(){
    fetch('/api/doeverything', {method: "GET"})
    .then((res) =>{
        console.log(res);
    });
  }
  render() {
    //console.log(spotifyAuthPath);
    return (
      <div className="App">
      <a href="https://jaredpresnell.me">
        <svg className="logo_sidebar" xmlns="http://www.w3.org/2000/svg" width="1.1in" height="1.1in" viewBox="100 100 310 310">
          <path id="logo_path" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="black" strokeWidth="6" d="M 106.00,155.00
                 C 106.00,155.00 401.00,151.00 401.00,151.00
                   401.00,151.00 260.00,251.00 260.00,251.00M 273.00,164.00
                 C 273.00,164.00 197.00,388.00 197.00,388.00
                   197.00,388.00 129.00,308.00 129.00,308.00"></path>
        </svg>
      </a>
        <h1 className="title">Friends Feed</h1>
            {/*<button onClick = {()=>this.doEverything()}>do everything</button>*/}
        <p className="description"><strong className="hello">Hello!</strong> and welcome to Friends Feed, a playlist for finding new music and keeping up with your friends. And maybe discovering your pal who you thought had great music taste is secretly into Nicki Minaj. Just kidding... hopefully.</p>
        <p className="description">Once you log into Spotify, this app will automatically add your top 5 most played songs from the last month to the playlist. The playlist auto updates every Friday, so be sure to check back every week. Scroll down to check out the current collection of songs, and to follow the playlist on Spotify.</p>


         {/*} You can take a listen <a className="playlist_link" href="https://open.spotify.com/user/waytoofatdolphin/playlist/674PhRT9Knua4GdUkgzTel?si=BvVhI-voTCugcTvfPT4vgw">here</a>, or scroll down to .</p>*/}
        <a href= {spotifyLoginPath}>
          <button className="login_button">Sign in and Start Listening!</button>
        </a>
        <TopSongs 
          tracks = {this.props.tracks}
          settings = {this.props.settings}
          lastUpdated = {this.props.lastUpdated}
        />
        <Users
          getUsers = {this.props.getUsers}
          users = {this.props.users}
          addUser = {this.props.addUser}
          hashParams = {this.props.hashParams}
          getTracks = {() => this.getTracks()}
          tracks = {this.props.tracks}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

