import React, { Component } from 'react';

class Login extends Component {
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

export default Login; 