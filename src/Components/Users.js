
import React, { Component } from 'react';
export default class Users extends Component {
  showUsers() {
      console.log(this.props.users);
  }
  render(){
    // if(this.props.users[0].name!=='' && this.props.tracks.length<1){
    //   this.props.getTracks();
    // }
    //this creates an infinite loop for some reason
    return (
      <div>
        {/*
        <button onClick = {() =>this.props.getUsers()}>
          Get Users
        </button>
        <button onClick = {() => this.showUsers()}>
          Show Users
        </button>
      */}
      </div>
    )
  } 
}  

