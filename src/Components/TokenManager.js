import { connect } from 'react-redux';
import React, { Component } from 'react';

export default class TokenManager extends Component {
  // editUserFunc(){
  //   this.props.editUser(name, accessToken, refreshToken);
  // }
  render(){
    return (
      <div>
        <button onClick = {() => this.props.getNewAccessTokens()}>
        REFRESH ALL TOKENS</button>
      </div>
    )
  } 
}  