import axios from 'axios';
import React, { Component } from 'react';
import { Redirect } from 'react-router';

function render_user_logged_in(data) {
    return (
        <div className="container">
<h4 className="center">User Profile</h4>
            <h2>full_name: {data.full_name}</h2>
            <h2>user_name: {data.username}</h2>
            <h2>role: {data.role}</h2>
            <h2>email: {data.email}</h2>
            <h2>disabled: {data.disabled}</h2>
        </div>
    )
};
function get_user_data_from_server() {
    if (localStorage.getItem("token") && localStorage.getItem('username')) {
        axios.get('http://192.116.98.107:8081/users', {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            params: {
                username: localStorage.getItem('username')
            }
        }).then(
            res => {
                return res.data;
            },
            err => {
                console.log(err);
                return null;
            }
        );
    }
    return null;
};
export default class UserProfile extends Component {
    state = {
        user_data: null,
        user_logged_in: false
    };

    render() {
        var data = get_user_data_from_server();
        if (data) {
            this.setState({ user_data: data, user_logged_in: true })
        }
        else {
            this.setState({ user_data: null, user_logged_in: false })
        }
        return (
            this.state.user_data ?
                (
                    render_user_logged_in(this.state.user_data)
                ) :
                (
                    <div className="container">
                        {/* <Redirect to="/" /> */}
                    </div>
                )
        )
                };
            };