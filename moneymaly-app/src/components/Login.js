import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {
    state = {
        username: null,
        password: null,
        fireRedirect: false
    }
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    get_login_token = () => {
        const data = 'username=' + this.state.username + '&password=' + this.state.password;
        axios.post('http://192.116.98.107:8081/token', data)            .then(res => {
                localStorage.setItem('token', res.data.access_token);
                localStorage.setItem('username', this.state.username);
                localStorage.setItem('user_logged_in', true);
            })
            .catch(err => {
                console.log(err);
            })
        return;

    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.get_login_token();
        console.log(localStorage.getItem('token'));
        setTimeout(() => this.setState({ fireRedirect: true }), 1000);

    }
    render() {
        return (
            <div className='container'>
                <form onSubmit={this.handleSubmit}>
                    <label> Username: </label><input type='text' onChange={this.handleChange} id='username' /><br />
                    <label> Password: </label><input type='password' onChange={this.handleChange} id='password' /><br />
                    <button onClick={this.handleSubmit} > Login </button>
                </form>
                {this.state.fireRedirect ? (<Redirect to="/" />) : (' ')}
            </div>
        );
    }
}