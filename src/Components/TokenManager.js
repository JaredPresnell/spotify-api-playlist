import { connect } from 'react-redux';
import React, { Component } from 'react';
  var accessToken ='';
  var refreshToken = '';
  var name = '';
export default class TokenManager extends Component {
  constructor(props){
    super(props);
    this.editUserFunc = this.editUserFunc.bind(this);
    this.getNewAccessToken = this.getNewAccessToken.bind(this);
  }
   getNewAccessToken(refreshToken){
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
        //this.editUserFunc();
        //this.props.editUser(resJSON.name, resJSON.accessToken, resJSON.refreshToken);
        // some redux shit that i dont understand: tldr, how do i get my redux here isntead of passing it
      });
    });
  }
  editUserFunc(){
    this.props.editUser(name, accessToken, refreshToken);
  }
  render(){
    return (
      <div>
        <button onClick = {() => this.getNewAccessToken(this.props.refreshToken)}>
        GET REFRESH TOKEN</button>
      </div>
    )
  } 
}  
