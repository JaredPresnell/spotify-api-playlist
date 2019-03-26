
import React, { Component } from 'react';
export default class Users extends Component {
  showUsers() {
      console.log(this.props.users);
  }
  handleSubmit(e){
    e.preventDefault();

    var accessToken = this.props.hashParams.access_token;
    var refreshToken = this.props.hashParams.refresh_token;

    let refs = this.refs;
    let name = refs.name.value;
    refs.name.value = ""; 

    this.props.addUser(name, accessToken, refreshToken);
  }
  render(){
    
    return (
      <div>
        
        <button onClick = {() =>this.props.getUsers()}>
          Get Users
        </button>
        <div>  
          <form onSubmit = {this.handleSubmit.bind(this)}>
            <input ref="name" placeholder="name"></input>
            <button type = "submit">
              Add User
            </button>
          </form>
        </div>
        <button onClick = {() => this.showUsers()}>
          Show Users
        </button>
        <div>
          <ul>
            {
              //this.props.users.map((user, i) => <li key={'userkey'+i}>{user.name}</li>)              
            }
          </ul>
        </div>
      </div>
    )
  } 
}  

