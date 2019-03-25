
import React, { Component } from 'react';
export default class Users extends Component {
  showUsers() {
      console.log(this.props.users);
  }
  handleSubmit(e){

  }
  render(){
    var name = 'newuser';
    var token = 'newtoken';
    return (
      <div>
        <form onSubmit = {() => this.handleSubmit}>
          <button onClick = {() =>this.props.getUsers()}>
            Get Users
          </button>
          <input placeholder="name"></input>
        </form>
        <button onClick = {() => this.props.addUser(name, token)}>
          Add User
        </button>
        <button onClick = {() => this.showUsers()}>
          Show Users
        </button>
        <div>
          <ul>
            {
              this.props.users.map((user, i) => <li key={'userkey'+i}>{user.name}</li>)              
            }
          </ul>
        </div>
      </div>
    )
  } 
}  

