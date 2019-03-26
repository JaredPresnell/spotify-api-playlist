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
import { getNewToken }      from './actions/getNewToken';

// COMPONENTS
import TopSongs from './Components/TopSongs'; 
import Users from './Components/Users';


const spotifyApi = new Spotify();

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
    //spotifyApi.getMyCurrentPlaybackState()
    const options = {limit: this.props.settings.count, offset: 0, time_range: this.props.settings.timeFrame};
    spotifyApi.getMyTopTracks(options)    
      .then((response)=>{
        console.log(response);
        // this.setState({
        //   topTracks: response.items,
        // });
        this.props.setTracks(response); 
        return response;
      });  
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
        <button onClick = {() => this.props.getNewToken(userRefreshToken)}>
        GET REFRESH TOKEN</button>

        <a href="http://localhost:8888/refresh_token">
          <button>Spotify!</button>
        </a>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
