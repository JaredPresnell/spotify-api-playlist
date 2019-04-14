import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spotify from 'spotify-web-api-js';
//import SpotifyWebApi from 'spotify-web-api-node';

import './App.css';

import { setTracks }        from './actions/setTracks';
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
    return "http://localhost:8888/"
  }
  else return "/spotify/"
}
function getSpotifyLoginPath(){
  if(window.location.host === "localhost:3000"){
    return "http://localhost:8888"
  }
  else return "/spotify/login"
}


const mapDispatchToProps = dispatch => ({
  setTracks: (tracks) => dispatch(setTracks(tracks)),
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
    console.log('handling my dude');
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.getMe().then((response) => {
        //this.props.addUser(response.id, response.display_name, accessToken, refreshToken);
        //console.log(this.props.addUser(response.id, response.display_name, accessToken, refreshToken));
        this.props.addUser(response.id, response.display_name, accessToken, refreshToken)
        .then(()=>{
          //and then set tracks
          // and then get tracks
          //fuck
          console.log('async redux LEGEND');
          this.getTracks();
          //this one is fine
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
      //basically i just need to get the data eg loadData();
      this.getTracks();
      //this one is fine too
      // fetch('/api/loadData', {method: "GET"})
      // .then((res)=> {
      //   console.log(res);
      // });
        // fetch('/api/doeverything', {method: "GET"})
        // .then((res)=>{
        //     console.log("inside fetch do everyhing");
        // });
    }
   
  }
  getTracks(){
    fetch('/api/gettracks', {method: "GET"})
    .then((res)=>{
      return res.json();
    })
    .then((resJSON)=>{
      console.log(resJSON);
      this.props.setTracks(resJSON.tracks);
      //** set last updated 
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
    // really all this should do is ping the database for the tracks
        // theres really no reason to go through all the steps every time    
    this.handleLoad();
    
    this.props.getUsers();
    if(this.props.users[0].name !== '')
        //this.getTopTracks();
        this.getTracks(); //fine
     
  }
  doEverything(){
    fetch('/api/doeverything', {method: "GET"})
    .then((res) =>{
        console.log(res);
    });
  }
  render() {
    console.log(spotifyAuthPath);
    return (
      <div className="App">

        <h1>Spotify Playlist API</h1>
        {/*<a href="/spotify/login">*/}
        <a href= {spotifyLoginPath}>
          <button>Log in to Spotify!</button>
        </a>
       <button onClick = {()=>this.doEverything()}>do everything</button>
        <TopSongs 
          tracks = {this.props.tracks}
          settings = {this.props.settings}
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

