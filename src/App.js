import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spotify from 'spotify-web-api-js';

import './App.css';

import { setTracks } from './actions/setTracks';
import { getHashParams } from './actions/getHashParams';
import { incrementCount } from './actions/incrementCount';
import { decrementCount } from './actions/decrementCount';
import { toggleTimeFrame } from './actions/toggleTimeFrame';

// COMPONENTS
import TopSongs from './Components/TopSongs'; 

const spotifyApi = new Spotify();

/* 
 * mapDispatchToProps
*/
const mapDispatchToProps = dispatch => ({
  setTracks: (tracks) => dispatch(setTracks(tracks)),
  getHashParams: () => dispatch(getHashParams()),
  incrementCount: () => dispatch(incrementCount()),
  decrementCount: () => dispatch(decrementCount()),
  toggleTimeFrame: () => dispatch(toggleTimeFrame())
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
    this.props.getHashParams();
  }
  constructor() {
    super();
  }
  render() {  
    if(this.props.hashParams.access_token){
      spotifyApi.setAccessToken(this.props.hashParams.access_token);
    }
    return (
      <div className="App">
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
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
