import React, { Component } from 'react';
import axios from 'axios'

export default class Login extends Component {
    state = {
        username: null,
        password: null
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    get_login_token = () => {
        const data = 'username=' + this.state.username + '&password=' + this.state.password;
        axios.post('/token', data)
            .then(res => {
                localStorage.setItem('token', res.data.access_token);
            })
            .catch(err => {
                console.log(err);
            })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.get_login_token();
        console.log(localStorage.getItem('token'));
    }
    render() {
        return (
            <div className='container'>
                <form onSubmit={this.handleSubmit}>
                    <label> Username: </label><input type='text' onChange={this.handleChange} id='username' /><br />
                    <label> Password: </label><input type='password' onChange={this.handleChange} id='password' /><br />
                    <button onClick={this.handleSubmit} > Login </button>
                </form>
            </div>
        );
    }
}