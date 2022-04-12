import './App.css';
import React, { Component } from 'react';

class App extends Component {
  state = {
    username: null,
    password: null
  }
    handleChange = (e) => {
    this.setState({
        [e.target.id]: e.target.value
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <a>AnoMoney-UI</a>
        </header>
        <p>Welcome to Money-Maly Application!</p>
        <form onSubmit={this.handleSubmit}>
        <a>Username:</a><input type='text' onChange={this.handleChange} id='username' /><br />
          <a>Password: </a><input type='password' onChange={this.handleChange} id='password' /><br />
          <button onClick={this.handleSubmit}>Login</button>
        </form>
      </div>
    );
  }
}

export default App;