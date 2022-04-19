import React, { Component } from 'react'
import { Redirect } from 'react-router';

class Logout extends Component {

    componentDidMount() {
        localStorage.clear();
        localStorage.setItem('user_logged_in', false);
    };

    render() {
        console.log('user_logged_in: ' + localStorage.getItem('user_logged_in'));
        return < Redirect to="/" />;
    }
}

export default Logout;