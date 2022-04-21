import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router';

export default function UserProfile() {
    const [user_data, setUserData] = React.useState(null);

    function render_user_logged_in(data) {
        console.log(data);
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
    const render_user_not_logged_in = (
        <div className="container">
            <Redirect to="/" />
        </div>
    );

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
                    setUserData(res.data);
                    console.log('Data was setted......')
                    return true;
                },
                err => {
                    // console.log(err);
                    return false;
                }
            );
        }
        return false;
    };


    return (
        get_user_data_from_server() ? (
            render_user_logged_in(user_data)
        ) : (
            { render_user_not_logged_in }
        )
    );
}; 