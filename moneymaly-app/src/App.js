import './App.css';
import React, { Component } from 'react';

class App extends Component {
  state = {
    username: 'username',
    password: 'password'
  }
  handleUserChange = (e) => {
    this.setState({
      username: e.target.value
    })
  }
  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    console.log('username: ', this.state.username, ' password: ', this.state.password)
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a>AnoMoney-UI</a>
        </header>
        <p>Welcome to Money-Maly Application!</p>

        <form onSubmit={this.handleSubmit}>
          <a>Username:</a><input type='text' onChange={this.handleUserChange} /><br />
          <a>Password: </a><input type='password' onChange={this.handlePasswordChange} /><br />
          <button onClick={this.handleSubmit}>Login</button>
        </form>

      </div>
    );
  }
}

export default App;